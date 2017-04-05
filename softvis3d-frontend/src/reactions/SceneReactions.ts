import {SceneStore} from "../stores/SceneStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {reaction} from "mobx";
import LegacyConnector from "../legacy/LegacyConnector";
import LoadAction from "../classes/status/LoadAction";

export default class SceneReactions {

    public static LOAD_SOFTVIS: LoadAction = new LoadAction("LOAD_SOFTVIS", "Create visualization");

    private builder: CityBuilderStore;
    private scene: SceneStore;
    private legacy: LegacyConnector;

    constructor(
        scene: SceneStore,
        builder: CityBuilderStore,
        legacy: LegacyConnector
    ) {
        this.builder = builder;
        this.scene = scene;
        this.legacy = legacy;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            "Transfer the chosen color from the scene to the builder",
            () => this.scene.options.metricColor,
            () => { this.builder.metricColor = this.scene.options.metricColor; }
        );

        reaction(
            "Rebuild city if color metric changed",
            () => this.scene.options.metricColor,
            () => {
                this.scene.colorsChanged = true;
                this.legacy.buildCity();
            }
        );

        reaction(
            "Convert backend data to threeJS shapes",
            () => this.scene.legacyData,
            () => {
                this.scene.colorsChanged = false;
                this.legacy.buildCity();
            }
        );

    }
}