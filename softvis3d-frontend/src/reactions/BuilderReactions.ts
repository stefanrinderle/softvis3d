import {reaction} from "mobx";
import VisualizationOptions from "../classes/VisualizationOptions";
import AutoReloadService from "../services/AutoReloadService";
import SonarQubeMeasuresService from "../services/sonarqube/measures/SonarQubeMeasuresService";
import {CityBuilderStore} from "../stores/CityBuilderStore";

export default class BuilderReactions {
    private cityBuilderStore: CityBuilderStore;
    private measuresService: SonarQubeMeasuresService;
    private autoReloadService: AutoReloadService;

    constructor(cityBuilderStore: CityBuilderStore, measuresService: SonarQubeMeasuresService,
                autoReloadService: AutoReloadService) {
        this.cityBuilderStore = cityBuilderStore;
        this.measuresService = measuresService;
        this.autoReloadService = autoReloadService;
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
                        this.cityBuilderStore.heightMetric, this.cityBuilderStore.metricColor,
                        this.cityBuilderStore.profile.scale, this.cityBuilderStore.houseColorMode);

                    this.measuresService.loadMeasures(options);
                    this.autoReloadService.startAutoReload();
                }
            },
            {
                name: "Transfer all required data to the scene"
            }
        );
    }
}