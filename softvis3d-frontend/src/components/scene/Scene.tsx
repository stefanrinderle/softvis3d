import * as React from "react";
import { observer } from "mobx-react";
import { SceneStore } from "../../stores/SceneStore";
import SoftVis3dScene from "./visualization/SoftVis3dScene";
import SceneInformation from "./information/SceneInformation";

interface SceneProps {
    sceneStore: SceneStore;
}

/**
 * Responsible for the drawing the canvas for the visualization.
 */
@observer
export default class Scene extends React.Component<SceneProps, any> {

    private static KEY_DOWN_EVENT_NAME: string = "keydown";
    private static KEY_CODE_R: number = 82;

    private mouseMoved: boolean = false;

    constructor() {
        super();
    }

    public componentDidMount() {
        this.props.sceneStore.scenePainter.init();
        this.props.sceneStore.refreshScene = true;
        this.props.sceneStore.sceneComponentIsMounted = true;

        if (this.props.sceneStore.selectedObjectId) {
            this.props.sceneStore.scenePainter.selectSceneTreeObject(this.props.sceneStore.selectedObjectId);
        }

        this.updateCameraPosition();

        /**
         * Why not onKeyDown?
         * The DOM wants the element to be focused in order to receive the keyboard event. If you don't want to hack the
         * element with tabIndex or contentEditable to get it to focus, you could use native DOM event listeners on window.
         * see http://stackoverflow.com/questions/32255075/react-not-responding-to-key-down-event
         * or https://www.npmjs.com/package/react-keydown
         *
         * Instead of a new library, i go for naive event listeners.
         */
        window.addEventListener(Scene.KEY_DOWN_EVENT_NAME, this.handleKeyDown.bind(this));
    }

    public componentWillUnmount() {
        this.props.sceneStore.sceneComponentIsMounted = false;

        window.removeEventListener(Scene.KEY_DOWN_EVENT_NAME, this.handleKeyDown.bind(this));
    }

    public render() {
        const {sceneStore} = this.props;

        return (
            <div className="scene">
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

    public handleKeyDown(event: KeyboardEvent) {
        if (event.keyCode === Scene.KEY_CODE_R) {
            this.props.sceneStore.scenePainter.resetCameraPosition(this.props.sceneStore.shapes);
        }
    }

    private onMouseUp(event: any) {
        this.updateCameraPosition();

        if (!this.mouseMoved) {
            this.props.sceneStore.selectedObjectId = this.props.sceneStore.scenePainter.makeSelection(event);
        }
    }

}
