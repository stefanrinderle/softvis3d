import * as React from "react";
import {observer} from "mobx-react";
import {SceneStore} from "../../stores/SceneStore";
import SceneInformation from "./information/SceneInformation";
import {KeyLegend} from "./KeyLegend";
import {SceneMouseInteractions} from "./events/SceneMouseInteractions";
import Event from "./events/Event";
import {SceneKeyInteractions} from "./events/SceneKeyInteractions";
import ThreeSceneService from "./visualization/ThreeSceneService";
import SoftVis3dScene from "./visualization/scene/SoftVis3dScene";

interface SceneProps {
    sceneStore: SceneStore;
}

interface SceneStates {
    focus: boolean;
    legend: boolean;
}
/**
 * Responsible for the drawing the canvas for the visualization.
 */
@observer
export default class Scene extends React.Component<SceneProps, SceneStates> {

    private _threeSceneService: ThreeSceneService;
    private _mouseActions: SceneMouseInteractions;
    private _keyActions: SceneKeyInteractions;

    constructor() {
        super();
        this.state = {
            focus: false,
            legend: true
        };
    }

    public componentDidMount() {
        this._threeSceneService = ThreeSceneService.create();

        this._mouseActions = new SceneMouseInteractions();
        this._mouseActions.onMouseDownEvent.addEventListener(this.handleMouseDown.bind(this));
        this._mouseActions.onMouseMovedEvent.addEventListener(this.updateCameraPosition.bind(this));
        this._mouseActions.onSelectObjectEvent.addEventListener(this.selectObject.bind(this));

        this._keyActions = new SceneKeyInteractions();
        this._keyActions.onResetCameraEvent.addEventListener(this.resetCamera.bind(this));
        this._keyActions.onToggleLegendEvent.addEventListener(this.toggleLegend.bind(this));

        this.props.sceneStore.sceneComponentIsMounted = true;
    }

    public componentWillUnmount() {
        this.props.sceneStore.sceneComponentIsMounted = false;

        this._mouseActions.destroy();
        this._keyActions.destroy();
    }

    public render() {
        const {sceneStore} = this.props;
        const {focus, legend} = this.state;

        if (sceneStore.sceneComponentIsMounted) {
            this._threeSceneService.update(sceneStore.shapes, sceneStore.sceneComponentIsMounted,
                sceneStore.colorsChanged, sceneStore.cameraPosition);
            this._threeSceneService.selectSceneTreeObject(this.props.sceneStore.selectedObjectId);
        }

        let cssClass = "scene";
        cssClass += focus ? " active" : "";

        return (
            <div id="scene-container" className={cssClass}>
                <KeyLegend show={legend}/>
                <canvas id={SoftVis3dScene.CANVAS_ID}
                        onMouseDown={() => { this._mouseActions.setMouseMoved(false); }}
                        onMouseMove={() => { this._mouseActions.setMouseMoved(true); }}
                        onMouseUp={(e) => { this._mouseActions.onMouseUp(e); }}
                />
                <SceneInformation sceneStore={sceneStore}/>
            </div>
        );
    }

    public updateCameraPosition() {
        this.props.sceneStore.cameraPosition = this._threeSceneService.getCameraPosition();
    }

    public handleMouseDown(event: Event<boolean>) {
        let isWithinScene: boolean = event.getType();
        if (isWithinScene ? !this.state.focus : this.state.focus) {
            this.setState({...this.state, focus: isWithinScene});
        }
    }

    /**
     * Test injection setter
     */

    public set threeSceneService(value: ThreeSceneService) {
        this._threeSceneService = value;
    }

    public set mouseActions(value: SceneMouseInteractions) {
        this._mouseActions = value;
    }

    public set keyActions(value: SceneKeyInteractions) {
        this._keyActions = value;
    }

    /**
     * private methods
     */

    private selectObject(event: Event<MouseEvent>) {
        this.props.sceneStore.selectedObjectId = this._threeSceneService.makeSelection(event.getType());
    }

    private resetCamera() {
        if (!this.state.focus) {
            return;
        }

        this._threeSceneService.resetCameraPosition(this.props.sceneStore.shapes);
    }

    private toggleLegend() {
        if (!this.state.focus) {
            return;
        }

        this.setState({...this.state, legend: !this.state.legend});
    }

}
