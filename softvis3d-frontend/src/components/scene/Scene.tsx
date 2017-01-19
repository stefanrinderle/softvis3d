import * as React from "react";
import { SoftVis3dScene } from "./visualization/SoftVis3dScene";
import { observer } from "mobx-react";
import { SceneStore } from "../../stores/SceneStore";
import { WebGLDetector } from "./webgl/WebGLDetector";
import { reaction } from "mobx";
import SceneInformation from "./information/SceneInformation";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

interface SceneProps {
    cityBuilderStore: CityBuilderStore;
    sceneStore: SceneStore;
}

/**
 * Responsible for the 3D visualization.
 *
 * TODO: would like to listen on the store change event within a method to be able to
 * call "select object" on the scene.
 */
@observer
export default class Scene extends React.Component<SceneProps, any> {

    private static CANVAS_ID: string = "softvis3dscene";
    private softVis3dScene: SoftVis3dScene;

    constructor() {
        super();
    }

    public componentDidMount() {
        if (WebGLDetector.isWebGLSupported()) {
            this.loadScene();
            // initial load - all other updates via the render method.
            this.softVis3dScene.loadSoftVis3d(this.props.sceneStore.shapes);

            reaction(
                "Select object in scene",
                () => this.props.sceneStore.selectedObjectId,
                () => { this.softVis3dScene.selectSceneTreeObject(this.props.sceneStore.selectedObjectId); }
            );
            reaction(
                "Load new objects in scene",
                () => this.props.sceneStore.shapes,
                () => { this.softVis3dScene.loadSoftVis3d(this.props.sceneStore.shapes); }
            );
        } else {
            console.warn(WebGLDetector.getWebGLErrorMessage());
        }
    }

    public render() {
        const {cityBuilderStore, sceneStore} = this.props;

        // needed because the scene object is not available on the first render.
        // but needed to use the "render" method if the shapes change.
        if (this.softVis3dScene !== undefined) {
            this.softVis3dScene.loadSoftVis3d(sceneStore.shapes);
        }

        return (
            <div className="scene">
                <canvas id={Scene.CANVAS_ID} onClick={this.makeSelection.bind(this)}/>
                <SceneInformation cityBuilderStore={cityBuilderStore} sceneStore={sceneStore}/>
           </div>
        );
    }

    private makeSelection(event: any) {
        if (!this.props.sceneStore.hasMouseMoved()) {
            let selectedId: string | null = this.softVis3dScene.makeSelection(event);
            this.props.sceneStore.setSelectedObjectId(selectedId);
        }

        this.props.sceneStore.resetMoved();
        console.log("reset moved");
    }

    private loadScene() {
        this.softVis3dScene = new SoftVis3dScene(Scene.CANVAS_ID);
        this.animate();
        this.addOrbitControlsListener();
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderScene();
    }

    private addOrbitControlsListener() {
        this.softVis3dScene.getControls().addEventListener("change", () => {
            console.warn("change");
            this.props.sceneStore.setMoved();
        });
    }

    private renderScene() {
        this.softVis3dScene.render();
    }

}