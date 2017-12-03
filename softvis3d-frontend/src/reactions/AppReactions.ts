import { CityBuilderStore } from "../stores/CityBuilderStore";
import { reaction } from "mobx";
import VisualizationOptions from "../classes/VisualizationOptions";
import SonarQubeMeasuresService from "../services/sonarqube/measures/SonarQubeMeasuresService";
import AutoReloadService from "../services/AutoReloadService";
import { AppStatusStore } from "../stores/AppStatusStore";

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
                        this.cityBuilderStore.heightMetric, this.cityBuilderStore.metricColor, this.cityBuilderStore.profile.scale);

                    this.measuresService.loadMeasures(options, true);
                }
            },
            {
                name: "Reload measures."
            }
        );
    }
}