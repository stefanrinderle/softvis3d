import * as React from "react";
import { SoftVis3dScene } from "./visualization/SoftVis3dScene";
import { observer } from "mobx-react";
import sceneStore from "../../stores/SceneStore";
import { WebGLDetector } from "./webgl/WebGLDetector";

/**
 * Responsible for the 3D visualization.
 *
 * TODO: would like to listen on the store change event within a method to be able to
 * call "select object" on the scene.
 */
@observer
export default class SceneComponent extends React.Component<any, any> {

    private static CANVAS_ID: string = "softvis3dscene";
    private scene: SoftVis3dScene;

    constructor() {
        super();
    }

    public componentDidMount() {
        if (WebGLDetector.isWebGLSupported()) {
            this.loadScene();
            // initial load - all other updates via the render method.
            this.scene.loadSoftVis3d(sceneStore.shapes);
        } else {
            // console.log(WebGLDetector.getWebGLErrorMessage());
        }
    }

    public render() {
        // needed because the scene object is not available on the first render.
        // but needed to use the "render" method if the shapes change.
        if (this.scene !== undefined) {
            this.scene.loadSoftVis3d(sceneStore.shapes);
        }

        return <canvas id={SceneComponent.CANVAS_ID} onClick={this.makeSelection.bind(this)} />;
    }

    private makeSelection(event: any) {
        let selectedId: string | null = this.scene.makeSelection(event);
        sceneStore.setSelectedObjectId(selectedId);
    }

    private loadScene() {
        this.scene = new SoftVis3dScene(SceneComponent.CANVAS_ID);
        this.animate();
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderScene();
    };

    private renderScene() {
        this.scene.render();
    }

}