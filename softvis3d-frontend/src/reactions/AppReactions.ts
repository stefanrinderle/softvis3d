import {reaction} from "mobx";
import VisualizationOptions from "../classes/VisualizationOptions";
import AutoReloadService from "../services/AutoReloadService";
import SonarQubeMeasuresService from "../services/sonarqube/measures/SonarQubeMeasuresService";
import {AppStatusStore} from "../stores/AppStatusStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";

export default class AppReactions {
    private cityBuilderStore: CityBuilderStore;
    private appStatusStore: AppStatusStore;
    private measuresService: SonarQubeMeasuresService;
    private autoReloadService: AutoReloadService;

    constructor(appStatusStore: AppStatusStore, cityBuilderStore: CityBuilderStore, measuresService: SonarQubeMeasuresService,
                autoReloadService: AutoReloadService) {
        this.appStatusStore = appStatusStore;
        this.cityBuilderStore = cityBuilderStore;
        this.measuresService = measuresService;
        this.autoReloadService = autoReloadService;
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

                    this.measuresService.loadMeasures(options, true);
                }
            },
            {
                name: "Reload measures."
            }
        );
    }
}