import {reaction} from "mobx";
import VisualizationOptions from "../classes/VisualizationOptions";
import {lazyInject} from "../inversify.config";
import AutoReloadService from "../services/AutoReloadService";
import SonarQubeMeasuresService from "../services/sonarqube/measures/SonarQubeMeasuresService";
import AppStatusStore from "../stores/AppStatusStore";
import CityBuilderStore from "../stores/CityBuilderStore";
import SceneStore from "../stores/SceneStore";

export default class BuilderReactions {
    private cityBuilderStore: CityBuilderStore;
    private appStatusStore: AppStatusStore;
    private sceneStore: SceneStore;

    @lazyInject("SonarQubeMeasuresService")
    private readonly measuresService!: SonarQubeMeasuresService;
    @lazyInject("AutoReloadService")
    private readonly autoReloadService!: AutoReloadService;

    constructor(appStatusStore: AppStatusStore, cityBuilderStore: CityBuilderStore, sceneStore: SceneStore) {
        this.appStatusStore = appStatusStore;
        this.cityBuilderStore = cityBuilderStore;
        this.sceneStore = sceneStore;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            () => this.cityBuilderStore.initiateBuildProcess,
            () => {
                if (this.cityBuilderStore.initiateBuildProcess) {
                    this.cityBuilderStore.initiateBuildProcess = false;

                    let options: VisualizationOptions = new VisualizationOptions(
                        this.cityBuilderStore.layout, this.cityBuilderStore.footprintMetric,
                        this.cityBuilderStore.heightMetric, this.cityBuilderStore.metricColor, this.cityBuilderStore.profile.scale);

                    this.measuresService.loadMeasures(this.appStatusStore, this.cityBuilderStore, this.sceneStore, options);
                    this.autoReloadService.startAutoReload(this.appStatusStore);
                }
            },
            {
                name: "Transfer all required data to the scene"
            }
        );
    }
}