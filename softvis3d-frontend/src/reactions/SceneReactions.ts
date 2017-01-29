import {SceneStore} from "../stores/SceneStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {reaction} from "mobx";
import LegacyConnector from "../legacy/LegacyConnector";
import SonarQubeLegacyService from "../services/sonarqube/SonarQubeLegacyService";

export default class SceneReactions {
    private builder: CityBuilderStore;
    private sceneStore: SceneStore;
    private legacy: LegacyConnector;
    private legacy2: SonarQubeLegacyService;

    constructor(
        sceneStore: SceneStore,
        builder: CityBuilderStore,
        legacy: LegacyConnector,
        legacy2: SonarQubeLegacyService
    ) {
        this.builder = builder;
        this.sceneStore = sceneStore;
        this.legacy = legacy;
        this.legacy2 = legacy2;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            "Transfer the chosen color from the scene to the builder",
            () => this.sceneStore.metricColor,
            () => { this.builder.metricColor = this.sceneStore.metricColor; }
        );

        reaction(
            "Load backend legacy data when the scene should be rendered",
            () => this.sceneStore.refreshScene,
            () => {
                if (this.sceneStore.refreshScene) {
                    this.legacy2.loadLegacyBackend();
                }
            }
        );

        reaction(
            "Load backend legacy data when the scene should be rendered",
            () => this.sceneStore.metricColor,
            () => {
                if (this.sceneStore.shapes !== null) {
                    this.legacy.buildCity();
                }
            }
        );

        reaction(
            "Convert backend data to threeJS shapes",
            () => this.sceneStore.legacyData,
            () => { this.legacy.buildCity(); }
        );

        reaction(
            "Load new objects in scene",
            () => [this.sceneStore.shapes, this.sceneStore.sceneComponentIsMounted],
            () => {
                if (this.sceneStore.shapes !== null && this.sceneStore.sceneComponentIsMounted) {
                    let shapes = this.sceneStore.shapes;
                    let colorsOnly = !this.sceneStore.refreshScene;

                    if (colorsOnly) {
                        this.sceneStore.scenePainter.updateColorsWithUpdatedShapes(shapes);
                    } else {
                        this.sceneStore.scenePainter.loadSoftVis3d(shapes);
                    }

                    this.sceneStore.refreshScene = false;
                }
            }
        );

        reaction(
            "Select object in scene",
            () => this.sceneStore.selectedObjectId,
            () => { this.sceneStore.scenePainter.selectSceneTreeObject(this.sceneStore.selectedObjectId); }
        );
    }
}