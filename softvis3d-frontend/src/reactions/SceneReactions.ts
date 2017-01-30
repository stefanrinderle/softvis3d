import {SceneStore} from "../stores/SceneStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {reaction} from "mobx";
import LegacyConnector from "../legacy/LegacyConnector";
import SonarQubeLegacyService from "../services/sonarqube/SonarQubeLegacyService";

export default class SceneReactions {
    private builder: CityBuilderStore;
    private scene: SceneStore;
    private legacy: LegacyConnector;
    private sonarService: SonarQubeLegacyService;

    constructor(
        scene: SceneStore,
        builder: CityBuilderStore,
        legacy: LegacyConnector,
        sonarService: SonarQubeLegacyService
    ) {
        this.builder = builder;
        this.scene = scene;
        this.legacy = legacy;
        this.sonarService = sonarService;
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
                    this.sonarService.loadLegacyBackend();
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

        reaction(
            "Load new objects in scene",
            () => [this.scene.shapes, this.scene.sceneComponentIsMounted],
            () => {
                if (this.scene.shapes !== null && this.scene.sceneComponentIsMounted) {
                    let shapes = this.scene.shapes;
                    let colorsOnly = !this.scene.refreshScene;

                    if (colorsOnly) {
                        this.scene.scenePainter.updateColorsWithUpdatedShapes(shapes);
                    } else {
                        this.scene.scenePainter.loadSoftVis3d(shapes);
                    }

                    this.scene.refreshScene = false;
                }
            }
        );

        reaction(
            "Select object in scene",
            () => this.scene.selectedObjectId,
            () => { this.scene.scenePainter.selectSceneTreeObject(this.scene.selectedObjectId); }
        );
    }
}