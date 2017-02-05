import {SceneStore} from "../stores/SceneStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {reaction} from "mobx";
import VisualizationOptions from "../classes/VisualizationOptions";

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
                    this.scene.options =
                        new VisualizationOptions(this.builder.layout, this.builder.profile.metricWidth,
                            this.builder.profile.metricHeight, this.builder.metricColor, this.builder.profile.scale);

                    this.scene.refreshScene = true;
                }
            }
        );
    }
}