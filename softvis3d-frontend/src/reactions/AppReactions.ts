import {reaction} from "mobx";
import VisualizationOptions from "../classes/VisualizationOptions";
import {lazyInject} from "../inversify.config";
import AutoReloadService from "../services/AutoReloadService";
import SonarQubeMeasuresService from "../services/sonarqube/measures/SonarQubeMeasuresService";
import AppStatusStore from "../stores/AppStatusStore";
import CityBuilderStore from "../stores/CityBuilderStore";
import SceneStore from "../stores/SceneStore";

export default class AppReactions {
    private readonly cityBuilderStore: CityBuilderStore;
    private readonly appStatusStore: AppStatusStore;
    private readonly sceneStore: SceneStore;

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
            () => this.appStatusStore.analysisDate,
            () => {
                if (this.autoReloadService.isActive()) {
                    let options: VisualizationOptions = new VisualizationOptions(
                        this.cityBuilderStore.layout, this.cityBuilderStore.footprintMetric,
                        this.cityBuilderStore.heightMetric, this.cityBuilderStore.metricColor,
                        this.cityBuilderStore.profile.scale, this.cityBuilderStore.houseColorMode);
                    this.measuresService.loadMeasures(this.appStatusStore, this.cityBuilderStore, this.sceneStore, options, true);
                } else {
                    return;
                }
            },
            {
                name: "Reload measures."
            }
        );
    }
}