import * as React from "react";
import { observer } from "mobx-react";
import { SceneStore } from "../../stores/SceneStore";
import SceneInformation from "./information/SceneInformation";
import { KeyLegend } from "./KeyLegend";
import { SceneKeyInteractions } from "./events/SceneKeyInteractions";
import ThreeSceneService from "./visualization/ThreeSceneService";
import ColorThemeSelector from "../../classes/ColorThemeSelector";
import SceneCanvas from "./SceneCanvas";

interface SceneProps {
    sceneStore: SceneStore;
}

interface SceneStates {
    mounted: boolean;
    focus: boolean;
    legend: boolean;
}

/**
 * Responsible for the drawing the canvas for the visualization.
 */
@observer
export default class Scene extends React.Component<SceneProps, SceneStates> {

    public static SCENE_CONTAINER_ID = "scene-container";

    private _threeSceneService: ThreeSceneService;
    private _keyActions: SceneKeyInteractions;
    private shapesHash: string = "";
    private selectedObjectIdState: string | null = null;

    constructor() {
        super();
        this.state = {
            mounted: false,
            focus: false,
            legend: true
        };
    }

    public componentDidMount() {
        this._threeSceneService = ThreeSceneService.create();

        this._keyActions = SceneKeyInteractions.create();
        this._keyActions.addResetCameraEventListener(this.resetCamera.bind(this));
        this._keyActions.addToggleLegendEventListener(this.toggleLegend.bind(this));
        this._keyActions.addToggleColorThemeEventListener(this.onToggleColorTheme.bind(this));

        this.setState({...this.state, mounted: true});
    }

    public componentWillUnmount() {
        this._keyActions.destroy();
        this.setState({...this.state, mounted: false});

        this._threeSceneService.destroy();
    }

    public render() {
        const {sceneStore} = this.props;
        const {focus, legend, mounted} = this.state;

        if (mounted) {
            this.processSceneUpdates();
        }

        let cssClass = "scene";
        cssClass += focus ? " active" : "";

        return (
            <div id={Scene.SCENE_CONTAINER_ID} className={cssClass}>
                <KeyLegend show={legend}/>
                <SceneCanvas selectObject={this.selectObject.bind(this)}
                             updateCameraPosition={this.updateCameraPosition.bind(this)}
                             updateSceneFocusState={this.updateSceneFocusState.bind(this)}
                />
                <SceneInformation sceneStore={sceneStore}/>
            </div>
        );
    }

    public processSceneUpdates() {
        const {sceneStore} = this.props;

        if (sceneStore.shapesHash !== this.shapesHash) {
            this._threeSceneService.update(
                sceneStore.shapes, sceneStore.options, sceneStore.colorTheme, sceneStore.cameraPosition);
            this.updateCameraPosition();
            this.shapesHash = sceneStore.shapesHash;
        } else if (sceneStore.selectedObjectId !== this.selectedObjectIdState) {
            this._threeSceneService.selectSceneTreeObject(sceneStore.selectedObjectId);
            this.selectedObjectIdState = sceneStore.selectedObjectId;
        }
    }

    /**
     * private methods
     */

    private updateCameraPosition() {
        this.props.sceneStore.cameraPosition = this._threeSceneService.getCameraPosition();
    }

    private updateSceneFocusState(newState: boolean) {
        this.setState({...this.state, focus: newState});

        if (newState) {
            this._keyActions.resume();
        } else {
            this._keyActions.halt();
        }
    }

    private selectObject(event: MouseEvent) {
        this.props.sceneStore.selectedObjectId = this._threeSceneService.makeSelection(event);
    }

    private resetCamera() {
        this._threeSceneService.resetCameraPosition(this.props.sceneStore.shapes);
    }

    private toggleLegend() {
        this.setState({...this.state, legend: !this.state.legend});
    }

    private onToggleColorTheme() {
        let resultColorTheme = ColorThemeSelector.toggleColorTheme(this.props.sceneStore.colorTheme);

        this._threeSceneService.setColorTheme(resultColorTheme);
        this.props.sceneStore.colorTheme = resultColorTheme;
    }

}
