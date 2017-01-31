import {SceneStore} from "../stores/SceneStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {reaction} from "mobx";

export default class BuilderReactions {
    private builder: CityBuilderStore;
    private scene: SceneStore;

    constructor(builder: CityBuilderStore, scene: SceneStore) {
        this.builder = builder;
        this.scene = scene;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            "Transfer all required data to the scene",
            () => this.builder.initiateBuildProcess,
            () => {
                if (this.builder.initiateBuildProcess) {
                    // Invalidate Existing Scene
                    this.scene.shapes = null;
                    this.builder.initiateBuildProcess = false;

                    // Transfer values
                    this.scene.layout = this.builder.layout;
                    this.scene.profile = this.builder.profile;
                    this.scene.metricColor = this.builder.metricColor;

                    this.scene.refreshScene = true;
                }
            }
        );
    }
}