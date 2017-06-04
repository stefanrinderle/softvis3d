import {CityBuilderStore} from "../stores/CityBuilderStore";
import {reaction} from "mobx";
import VisualizationOptions from "../classes/VisualizationOptions";
import SonarQubeMeasuresService from "../services/sonarqube/measures/SonarQubeMeasuresService";
import {lazyInject} from "../inversify.config";

export default class BuilderReactions {
    private builder: CityBuilderStore;
    @lazyInject("SonarQubeMeasuresService")
    private measuresService: SonarQubeMeasuresService;

    constructor(builder: CityBuilderStore) {
        this.builder = builder;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            () => this.builder.initiateBuildProcess,
            () => {
                if (this.builder.initiateBuildProcess) {
                    this.builder.initiateBuildProcess = false;

                    let options: VisualizationOptions = new VisualizationOptions(this.builder.layout, this.builder.footprintMetric,
                        this.builder.heightMetric, this.builder.metricColor, this.builder.profile.scale);

                    this.measuresService.loadMeasuresInitial(options);
                }
            },
            {
                name: "Transfer all required data to the scene"
            }
        );
    }
}