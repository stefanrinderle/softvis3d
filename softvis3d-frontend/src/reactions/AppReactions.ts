import {reaction} from "mobx";
import VisualizationOptions from "../classes/VisualizationOptions";
import {lazyInject} from "../inversify.config";
import AutoReloadService from "../services/AutoReloadService";
import SonarQubeMeasuresService from "../services/sonarqube/measures/SonarQubeMeasuresService";
import {AppStatusStore} from "../stores/AppStatusStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";

export default class AppReactions {
    private cityBuilderStore: CityBuilderStore;
    private appStatusStore: AppStatusStore;
    @lazyInject("SonarQubeMeasuresService")
    private readonly measuresService!: SonarQubeMeasuresService;
    @lazyInject("AutoReloadService")
    private readonly autoReloadService!: AutoReloadService;

    constructor(appStatusStore: AppStatusStore, cityBuilderStore: CityBuilderStore) {
        this.appStatusStore = appStatusStore;
        this.cityBuilderStore = cityBuilderStore;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            () => this.appStatusStore.analysisDate,
            () => {
                if (this.autoReloadService.isActive()) {
                    let options: VisualizationOptions = new VisualizationOptions(
                        this.cityBuilderStore.layout, this.cityBuilderStore.footprintMetric,
                        this.cityBuilderStore.heightMetric, this.cityBuilderStore.metricColor, this.cityBuilderStore.profile.scale);
                    this.measuresService.loadMeasures(options, true);
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