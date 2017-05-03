import {CityBuilderStore} from "../stores/CityBuilderStore";
import {reaction} from "mobx";
import VisualizationOptions from "../classes/VisualizationOptions";
import SonarQubeMeasuresService from "../services/sonarqube/measures/SonarQubeMeasuresService";

export default class BuilderReactions {
    private builder: CityBuilderStore;
    private measuresService: SonarQubeMeasuresService;

    constructor(builder: CityBuilderStore, measuresService: SonarQubeMeasuresService) {
        this.builder = builder;
        this.measuresService = measuresService;
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

                    this.measuresService.loadMeasuresInitial(options);
                }
            }
        );
    }
}