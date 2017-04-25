import { CityBuilderStore } from "../stores/CityBuilderStore";
import { reaction } from "mobx";
import VisualizationOptions from "../classes/VisualizationOptions";
import SonarQubeLegacyService from "../services/sonarqube/SonarQubeLegacyService";

export default class BuilderReactions {
    private builder: CityBuilderStore;
    private sonarService: SonarQubeLegacyService;

    constructor(builder: CityBuilderStore, sonarService: SonarQubeLegacyService) {
        this.builder = builder;
        this.sonarService = sonarService;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            "Transfer all required data to the scene",
            () => this.builder.initiateBuildProcess,
            () => {
                if (this.builder.initiateBuildProcess) {
                    this.builder.initiateBuildProcess = false;

                    let options: VisualizationOptions = new VisualizationOptions(this.builder.layout, this.builder.footprintMetric,
                        this.builder.heightMetric, this.builder.metricColor, this.builder.profile.scale);

                    this.sonarService.loadLegacyBackend(options);
                }
            }
        );
    }
}