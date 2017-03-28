import * as React from "react";
import { observer } from "mobx-react";
import { SceneStore } from "../../stores/SceneStore";
import SoftVis3dScene from "./visualization/SoftVis3dScene";
import SceneInformation from "./information/SceneInformation";
import {KeyLegend} from "./KeyLegend";
import {HtmlDom} from "../../services/HtmlDom";

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

    private static EVENT_KEY_DOWN: string = "keydown";
    private static EVENT_MOUSE_DOWN: string = "mousedown";
    private static KEY_CODE_R: number = 82;
    private static KEY_CODE_L: number = 76;

    private mouseMoved: boolean = false;

    constructor() {
        super();
        this.state = {
            focus: false,
            legend: true
        };
    }

    public componentDidMount() {
        this.props.sceneStore.scenePainter.init();
        this.props.sceneStore.refreshScene = true;
        this.props.sceneStore.sceneComponentIsMounted = true;

        if (this.props.sceneStore.selectedObjectId) {
            this.props.sceneStore.scenePainter.selectSceneTreeObject(this.props.sceneStore.selectedObjectId);
        }

        this.updateCameraPosition();
        window.addEventListener(Scene.EVENT_MOUSE_DOWN, this.handleMouseDown.bind(this));
        window.addEventListener(Scene.EVENT_KEY_DOWN, this.handleKeyDown.bind(this));
    }

    public componentWillUnmount() {
        this.props.sceneStore.sceneComponentIsMounted = false;

        window.removeEventListener(Scene.EVENT_MOUSE_DOWN, this.handleMouseDown.bind(this));
        window.removeEventListener(Scene.EVENT_KEY_DOWN, this.handleKeyDown.bind(this));
    }

    public render() {
        const {sceneStore} = this.props;
        const {focus, legend} = this.state;

        let cssClass = "scene";
        cssClass += focus ? " active" : "";

        return (
            <div id="scene-container" className={cssClass}>
                <KeyLegend show={legend} />
                <canvas id={SoftVis3dScene.CANVAS_ID}
                        onMouseDown={() => { this.mouseMoved = false; }}
                        onMouseMove={() => { this.mouseMoved = true; }}
                        onMouseUp={(e) => { this.onMouseUp(e); }}
                        />
                <SceneInformation sceneStore={sceneStore}/>
           </div>
        );
    }

    // public for tests
    public updateCameraPosition() {
        this.props.sceneStore.cameraPosition = this.props.sceneStore.scenePainter.getCamera().position;
    }

    public handleMouseDown(event: MouseEvent) {
        const self = document.getElementById("scene-container");
        let isWithinScene = event.target === self || HtmlDom.isDescendant(self, event.target as HTMLElement);
        if (isWithinScene ? !this.state.focus : this.state.focus) {
            this.setState({...this.state, focus: isWithinScene});
        }
    }

    public handleKeyDown(event: KeyboardEvent) {
        if (!this.state.focus) {
            return;
        }

        switch (event.keyCode) {
            case Scene.KEY_CODE_R:
                this.props.sceneStore.scenePainter.resetCameraPosition(this.props.sceneStore.shapes);
                break;
            case Scene.KEY_CODE_L:
                this.setState({...this.state, legend: !this.state.legend});
                break;
            default:
                // KEY NOT REGISTERED
        }
    }

    private onMouseUp(event: any) {
        this.updateCameraPosition();

        if (!this.mouseMoved) {
            this.props.sceneStore.selectedObjectId = this.props.sceneStore.scenePainter.makeSelection(event);
        }
    }

}
