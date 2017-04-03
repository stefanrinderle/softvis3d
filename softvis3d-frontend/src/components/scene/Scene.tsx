import * as React from "react";
import {observer} from "mobx-react";
import {SceneStore} from "../../stores/SceneStore";
import SceneInformation from "./information/SceneInformation";
import {KeyLegend} from "./KeyLegend";
import {SceneMouseInteractions} from "./SceneMouseInteractions";
import {Event} from "./EventDispatcher";
import {SceneKeyInteractions} from "./SceneKeyInteractions";
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

    private threeSceneService: ThreeSceneService;
    private mouseActions: SceneMouseInteractions;
    private keyActions: SceneKeyInteractions;

    constructor() {
        super();
        this.state = {
            focus: false,
            legend: true
        };
    }

    public componentDidMount() {
        this.threeSceneService = new ThreeSceneService();

        this.props.sceneStore.refreshScene = true;
        this.props.sceneStore.sceneComponentIsMounted = true;

        this.mouseActions = new SceneMouseInteractions();
        this.mouseActions.onMouseDownEvent.addEventListener(this.handleMouseDown.bind(this));
        this.mouseActions.onMouseMovedEvent.addEventListener(this.updateCameraPosition.bind(this));
        this.mouseActions.onSelectObjectEvent.addEventListener(this.selectObject.bind(this));

        this.keyActions = new SceneKeyInteractions();
        this.keyActions.onResetCameraEvent.addEventListener(this.resetCamera.bind(this));
        this.keyActions.onToggleLegendEvent.addEventListener(this.toggleLegend.bind(this));
    }

    public componentWillUnmount() {
        this.props.sceneStore.sceneComponentIsMounted = false;

        this.mouseActions.unmount();
        this.keyActions.unmount();
    }

    public render() {
        const {sceneStore} = this.props;
        const {focus, legend} = this.state;

        if (sceneStore.sceneComponentIsMounted) {
            this.threeSceneService.update(sceneStore.shapes, sceneStore.sceneComponentIsMounted,
                sceneStore.refreshScene, sceneStore.cameraPosition);
            this.threeSceneService.selectSceneTreeObject(this.props.sceneStore.selectedObjectId);
        }

        let cssClass = "scene";
        cssClass += focus ? " active" : "";

        return (
            <div id="scene-container" className={cssClass}>
                <KeyLegend show={legend}/>
                <canvas id={SoftVis3dScene.CANVAS_ID}
                        onMouseDown={() => { this.mouseActions.setMouseMoved(false); }}
                        onMouseMove={() => { this.mouseActions.setMouseMoved(true); }}
                        onMouseUp={(e) => { this.mouseActions.onMouseUp(e); }}
                />
                <SceneInformation sceneStore={sceneStore}/>
            </div>
        );
    }

    // public for tests
    public updateCameraPosition() {
        this.props.sceneStore.cameraPosition = this.threeSceneService.getCameraPosition();
    }

    public handleMouseDown(event: Event<boolean>) {
        let isWithinScene: boolean = event.getType();
        if (isWithinScene ? !this.state.focus : this.state.focus) {
            this.setState({...this.state, focus: isWithinScene});
        }
    }

    private selectObject(event: Event<MouseEvent>) {
        this.props.sceneStore.selectedObjectId = this.threeSceneService.makeSelection(event.getType());
    }

    private resetCamera() {
        if (!this.state.focus) {
            return;
        }

        this.threeSceneService.resetCameraPosition(this.props.sceneStore.shapes);
    }

    private toggleLegend() {
        if (!this.state.focus) {
            return;
        }

        this.setState({...this.state, legend: !this.state.legend});
    }
}
