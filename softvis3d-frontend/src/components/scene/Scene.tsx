///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import { observer } from "mobx-react";
import * as React from "react";
import { lazyInject } from "../../inversify.config";
import SceneStore from "../../stores/SceneStore";
import VisualizationOptionStore from "../../stores/VisualizationOptionStore";
import { SceneKeyInteractions } from "./events/SceneKeyInteractions";
import SceneInformation from "./information/SceneInformation";
import { KeyLegend } from "./KeyLegend";
import SceneCanvas from "./SceneCanvas";
import ThreeSceneService from "./visualization/ThreeSceneService";

interface SceneStates {
    mounted: boolean;
    focus: boolean;
    legend: boolean;
}

/**
 * Responsible for the drawing the canvas for the visualization.
 */
@observer
export default class Scene extends React.Component<Record<string, unknown>, SceneStates> {
    public static SCENE_CONTAINER_ID = "scene-container";

    @lazyInject("SceneStore")
    private readonly sceneStore!: SceneStore;
    @lazyInject("VisualizationOptionStore")
    private readonly visualizationOptions!: VisualizationOptionStore;

    private _threeSceneService: ThreeSceneService;
    private _keyActions: SceneKeyInteractions;
    private shapesHash = "";
    private selectedObjectIdState: string | null = null;

    constructor() {
        super();
        this.state = {
            mounted: false,
            focus: false,
            legend: true,
        };

        // FIXME!!!
        this._threeSceneService = undefined as any;
        this._keyActions = undefined as any;
    }

    public componentDidMount() {
        this._threeSceneService = ThreeSceneService.create();

        this._keyActions = SceneKeyInteractions.create();
        this._keyActions.addResetCameraEventListener(this.resetCamera.bind(this));
        this._keyActions.addToggleLegendEventListener(this.toggleLegend.bind(this));

        this.setState({ ...this.state, mounted: true });
    }

    public componentWillUnmount() {
        this._keyActions.destroy();
        this.setState({ ...this.state, mounted: false });

        this._threeSceneService.destroy();
    }

    public render() {
        const { focus, legend, mounted } = this.state;

        if (mounted) {
            this.processSceneUpdates();
        }

        let cssClass = "scene";
        cssClass += focus ? " active" : "";

        return (
            <div id={Scene.SCENE_CONTAINER_ID} className={cssClass}>
                <KeyLegend show={legend} />
                <SceneCanvas
                    selectObject={this.selectObject.bind(this)}
                    updateCameraPosition={this.updateCameraPosition.bind(this)}
                    updateSceneFocusState={this.updateSceneFocusState.bind(this)}
                />
                <SceneInformation />
            </div>
        );
    }

    public processSceneUpdates() {
        if (this.sceneStore.shapesHash !== this.shapesHash) {
            this._threeSceneService.update(
                this.sceneStore.shapes,
                this.visualizationOptions,
                this.sceneStore.cameraPosition
            );
            this.updateCameraPosition();
            this.shapesHash = this.sceneStore.shapesHash;

            this._threeSceneService.selectSceneTreeObject(this.sceneStore.selectedObjectKey);
            this.selectedObjectIdState = this.sceneStore.selectedObjectKey;
        }
        if (this.sceneStore.selectedObjectKey !== this.selectedObjectIdState) {
            this._threeSceneService.selectSceneTreeObject(this.sceneStore.selectedObjectKey);
            this.selectedObjectIdState = this.sceneStore.selectedObjectKey;
        }
    }

    /**
     * private methods
     */

    private updateCameraPosition() {
        this.sceneStore.cameraPosition = this._threeSceneService.getCameraPosition();
    }

    private updateSceneFocusState(newState: boolean) {
        this.setState({ ...this.state, focus: newState });

        if (newState) {
            this._keyActions.resume();
        } else {
            this._keyActions.halt();
        }
    }

    private selectObject(event: MouseEvent) {
        this.sceneStore.selectedObjectKey = this._threeSceneService.makeSelection(event);
    }

    private resetCamera() {
        this._threeSceneService.resetCameraPosition(this.sceneStore.shapes);
    }

    private toggleLegend() {
        this.setState({ ...this.state, legend: !this.state.legend });
    }
}
