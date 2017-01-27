import * as React from "react";
import { observer } from "mobx-react";
import { SoftVis3dScene } from "./visualization/SoftVis3dScene";
import { SceneStore } from "../../stores/SceneStore";
import SceneInformation from "./information/SceneInformation";

interface SceneProps {
    sceneStore: SceneStore;
}

/**
 * Responsible for the drawing the canvas for the visualization.
 */
@observer
export default class Scene extends React.Component<SceneProps, any> {

    private mouseMoved: boolean = false;

    constructor() {
        super();
    }

    public componentDidMount() {
        this.props.sceneStore.scenePainter.init();
        this.animate();
        this.addOrbitControlsListener();

        // initial load - all other updates via the render method.
        this.props.sceneStore.scenePainter.loadSoftVis3d(this.props.sceneStore.shapes);
        this.props.sceneStore.refreshScene = false;
        this.props.sceneStore.initialRenderComplete = true;
    }

    public render() {
        const {sceneStore} = this.props;

        return (
            <div className="scene">
                <canvas id={SoftVis3dScene.CANVAS_ID} onClick={this.makeSelection.bind(this)}/>
                <SceneInformation sceneStore={sceneStore}/>
           </div>
        );
    }

    private makeSelection(event: any) {
        if (!this.mouseMoved) {
            this.props.sceneStore.selectedObjectId = this.props.sceneStore.scenePainter.makeSelection(event);
        }

        this.mouseMoved = false;
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.props.sceneStore.scenePainter.render();
    }

    private addOrbitControlsListener() {
        this.props.sceneStore.scenePainter.getControls().addEventListener("change", () => {
            this.mouseMoved = true;
        });
    }
}