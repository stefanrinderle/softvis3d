import {SceneStore} from "../stores/SceneStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {reaction} from "mobx";
import LegacyConnector from "../legacy/LegacyConnector";
import SonarQubeLegacyService from "../services/sonarqube/SonarQubeLegacyService";

export default class SceneReactions {
    private builder: CityBuilderStore;
    private scene: SceneStore;
    private legacy: LegacyConnector;
    private legacy2: SonarQubeLegacyService;

    constructor(scene: SceneStore, builder: CityBuilderStore, legacy: LegacyConnector, legacy2: SonarQubeLegacyService) {
        this.builder = builder;
        this.scene = scene;
        this.legacy = legacy;
        this.legacy2 = legacy2;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            "Transfer the chosen color from the scene to the builder",
            () => this.scene.metricColor,
            () => { this.builder.metricColor = this.scene.metricColor; }
        );

        reaction(
            "Load backend legacy data when the scene should be rendered",
            () => this.scene.refreshScene,
            () => {
                if (this.scene.refreshScene) {
                    this.legacy2.loadLegacyBackend();
                }
            }
        );

        reaction(
            "Load backend legacy data when the scene should be rendered",
            () => this.scene.metricColor,
            () => {
                if (this.scene.shapes !== null) {
                    this.legacy.buildCity();
                }
            }
        );

        reaction(
            "Convert backend data to threeJS shapes",
            () => this.scene.legacyData,
            () => { this.legacy.buildCity(); }
        );
    }
}