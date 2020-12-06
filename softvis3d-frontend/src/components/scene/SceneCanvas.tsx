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



import * as React from "react";
import { observer } from "mobx-react";
import { SceneMouseInteractions } from "./events/SceneMouseInteractions";
import Event from "./events/Event";
import SoftVis3dScene from "./visualization/scene/SoftVis3dScene";

interface SceneCanvasProps {
    selectObject(event: MouseEvent): void;
    updateCameraPosition(): void;
    updateSceneFocusState(isWithinScene: boolean): void;
}

/**
 * Responsible for the drawing the canvas for the visualization.
 */
@observer
export default class SceneCanvas extends React.Component<SceneCanvasProps, any> {

    private _mouseActions?: SceneMouseInteractions;

    public componentDidMount() {
        this._mouseActions = SceneMouseInteractions.create();
        this._mouseActions.addMouseDownEventListener(this.handleMouseDown.bind(this));
        this._mouseActions.addMouseMovedEventListener(this.props.updateCameraPosition);
        this._mouseActions.addSelectObjectEventEventListener(this.handleSelectObject.bind(this));
    }

    public componentWillUnmount() {
        if (!this._mouseActions) { throw Error("mouse actions not defined"); }

        this._mouseActions.destroy();
    }

    public render() {
        return (
            <canvas id={SoftVis3dScene.CANVAS_ID}
                    onMouseDown={() => {
                        if (this._mouseActions) { this._mouseActions.setMouseMoved(false); }
                    }}
                    onMouseMove={() => {
                        if (this._mouseActions) { this._mouseActions.setMouseMoved(true); }
                    }}
                    onMouseUp={(e) => {
                        if (this._mouseActions) { this._mouseActions.onMouseUp(e); }
                    }}
            />
        );
    }

    public handleMouseDown(event: Event<boolean>) {
        this.props.updateSceneFocusState(event.getValue());
    }

    public handleSelectObject(event: Event<MouseEvent>) {
        this.props.selectObject(event.getValue());
    }

}
