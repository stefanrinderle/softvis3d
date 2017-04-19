import {SceneStore} from "../stores/SceneStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {reaction} from "mobx";
import LegacyCityCreator from "../legacy/LegacyCityCreator";
import SonarQubeLegacyService from "../services/sonarqube/SonarQubeLegacyService";
import {AppStatusStore} from "../stores/AppStatusStore";
import LoadAction from "../classes/status/LoadAction";
import SonarQubeScmService from "../services/sonarqube/SonarQubeScmService";
import {numberOfAuthorsBlameColorMetric} from "../constants/Metrics";

export default class SceneReactions {

    public static LOAD_SOFTVIS: LoadAction = new LoadAction("LOAD_SOFTVIS", "Create visualization");

    private builder: CityBuilderStore;
    private scene: SceneStore;
    private appStatusStore: AppStatusStore;
    private legacy: LegacyCityCreator;
    private sonarService: SonarQubeLegacyService;
    private scmService: SonarQubeScmService;

    constructor(
        scene: SceneStore,
        builder: CityBuilderStore,
        appStatusStore: AppStatusStore,
        legacy: LegacyCityCreator,
        sonarService: SonarQubeLegacyService,
        scmService: SonarQubeScmService
    ) {
        this.builder = builder;
        this.scene = scene;
        this.appStatusStore = appStatusStore;
        this.legacy = legacy;
        this.sonarService = sonarService;
        this.scmService = scmService;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            "Transfer the chosen color from the scene to the builder",
            () => this.scene.options.metricColor,
            () => {
                this.builder.metricColor = this.scene.options.metricColor;
            }
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
            "Rebuild city if color metric changed",
            () => this.scene.options.metricColor,
            () => {
                if (this.scene.shapes !== null) {
                    this.buildCity();
                }
            }
        );

        reaction(
            "Convert backend data to threeJS shapes",
            () => this.scene.legacyData,
            () => {
                this.buildCity();
            }
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
                        this.appStatusStore.load(SceneReactions.LOAD_SOFTVIS);
                        this.scene.scenePainter.loadSoftVis3d(shapes, this.scene.cameraPosition);
                        this.appStatusStore.loadComplete(SceneReactions.LOAD_SOFTVIS);
                    }

                    this.scene.refreshScene = false;
                }
            }
        );

        reaction(
            "Select object in scene",
            () => this.scene.selectedObjectId,
            () => {
                this.scene.scenePainter.selectSceneTreeObject(this.scene.selectedObjectId);
            }
        );
    }

    private buildCity() {
        if (this.scene.options.metricColor === numberOfAuthorsBlameColorMetric && !this.scene.scmMetricLoaded) {
            this.scmService.checkScmInfosAvailable().then((result: boolean) => {
                if (result) {
                    this.scmService.loadScmInfos().then(() => {
                        this.scene.scmMetricLoaded = true;
                        this.legacy.createCity();
                    });
                } else {
                    this.legacy.createCity();
                }
            });
        } else {
            this.legacy.createCity();
        }
    }
}