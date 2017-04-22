import {SceneStore} from "../stores/SceneStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {reaction} from "mobx";
import LegacyCityCreator from "../legacy/LegacyCityCreator";
import LoadAction from "../classes/status/LoadAction";

export default class SceneReactions {

    public static LOAD_SOFTVIS: LoadAction = new LoadAction("LOAD_SOFTVIS", "Create visualization");

    private builder: CityBuilderStore;
    private scene: SceneStore;
    private legacy: LegacyCityCreator;

    constructor(
        scene: SceneStore,
        builder: CityBuilderStore,
        legacy: LegacyCityCreator
    ) {
        this.builder = builder;
        this.scene = scene;
        this.legacy = legacy;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            "Transfer the chosen color from the scene to the builder and rebuild city",
            () => this.scene.options.metricColor,
            () => {
                this.builder.metricColor = this.scene.options.metricColor;
                this.legacy.createCity();
            }
        );

        reaction(
            "Convert backend data to threeJS shapes",
            () => this.scene.legacyData,
            () => {
                this.legacy.createCity();
            }
        );
    }
}