import * as React from "react";
import { SoftVis3dScene } from "./visualization/SoftVis3dScene";

export default class SceneComponent extends React.Component<any, any> {

    private canvasId: string = "softvis3dscene";
    private scene: SoftVis3dScene;
    private softvis3dSceneElement: HTMLCanvasElement;

    constructor() {
        super();
    }

    public componentDidMount() {
        this.loadScene();
        // initial load - all other updates via the render method.
        this.scene.loadSoftVis3d(this.props.shapes);
    }

    public render() {
        // needed because the scene object is not available on the first render.
        // but needed to use the "render" method if the shapes change.
        if (this.scene !== undefined) {
            this.scene.loadSoftVis3d(this.props.shapes);
        }

        return <canvas id={this.canvasId}
                       ref={(softvis3dScene) => this.softvis3dSceneElement = softvis3dScene}
                       onClick={this.makeSelection.bind(this)} />;
    }

    private loadScene() {
        this.scene = new SoftVis3dScene(this.canvasId);
        this.animate();
    }

    private makeSelection(event: any) {
        // let selectedId: string | null =
        this.scene.makeSelection(event, "#" + this.canvasId);

        // console.log("selectedId: " + selectedId);
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderScene();
    };

    private renderScene() {
        this.scene.render();
    }

}