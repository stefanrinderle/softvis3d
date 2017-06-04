import * as React from "react";
import * as ReactDOM from "react-dom";
import Softvis3D from "./components/Softvis3D";
import appStatusStore from "./stores/AppStatusStore";
import cityBuilderStore from "./stores/CityBuilderStore";
import sceneStore from "./stores/SceneStore";
import SonarQubeMetricsService from "./services/sonarqube/SonarQubeMetricsService";
import WebGLDetector from "./services/WebGLDetector";
import SceneReactions from "./reactions/SceneReactions";
import BuilderReactions from "./reactions/BuilderReactions";
import ErrorAction from "./classes/status/ErrorAction";
import VisualizationLinkService from "./services/VisualizationLinkService";
import SonarQubeScmService from "./services/sonarqube/SonarQubeScmService";
import SonarQubeMeasuresService from "./services/sonarqube/measures/SonarQubeMeasuresService";
import SonarQubeMeasuresApiService from "./services/sonarqube/measures/SonarQubeMeasuresApiService";
import SonarQubeMeasuresTreeService from "./services/sonarqube/measures/SonarQubeMeasuresTreeService";
import SonarQubeMeasuresMetricService from "./services/sonarqube/measures/SonarQubeMeasuresMetricService";
import {CityLayoutService} from "./services/layout/CityLayoutService";
import {container} from "./inversify.config";

export interface AppConfiguration {
    api: string;
    projectKey: string;
    isDev: boolean;
}

export default class App {
    private static WEBGL_ERROR_KEY: string = "WEBGL_ERROR";

    private communicator: SonarQubeMetricsService;
    private visualizationLinkService: VisualizationLinkService;
    private cityLayoutService: CityLayoutService;

    //noinspection JSMismatchedCollectionQueryUpdate
    private reactions: any[];

    public constructor(config: AppConfiguration) {
        appStatusStore.showLoadingQueue = config.isDev;

        this.visualizationLinkService = new VisualizationLinkService(cityBuilderStore, sceneStore);
        container.bind<VisualizationLinkService>("VisualizationLinkService")
            .toConstantValue(this.visualizationLinkService);

        this.communicator = new SonarQubeMetricsService(config.api, appStatusStore, cityBuilderStore);
        container.bind<SonarQubeMetricsService>("SonarQubeMetricsService")
            .toConstantValue(this.communicator);

        container.bind<SonarQubeScmService>("SonarQubeScmService")
            .toConstantValue(new SonarQubeScmService(config.api, appStatusStore, sceneStore));
        container.bind<SonarQubeMeasuresApiService>("SonarQubeMeasuresApiService")
            .toConstantValue(new SonarQubeMeasuresApiService(config.api, config.projectKey));

        let measuresTreeService = new SonarQubeMeasuresTreeService(appStatusStore);
        let measuresMetricService = new SonarQubeMeasuresMetricService(cityBuilderStore);
        let measuresService = new SonarQubeMeasuresService(config.projectKey, measuresTreeService, measuresMetricService,
            appStatusStore, cityBuilderStore, sceneStore);
        this.cityLayoutService = new CityLayoutService(sceneStore, appStatusStore);

        this.reactions = [
            new SceneReactions(sceneStore, cityBuilderStore, this.cityLayoutService),
            new BuilderReactions(cityBuilderStore, measuresService)
        ];
    }

    public run(target: string) {
        this.communicator.loadAvailableMetrics().then(() => {
            this.visualizationLinkService.process(document.location.search);
        });

        this.assertRequirementsAreMet();

        ReactDOM.render(
            <Softvis3D sceneStore={sceneStore} cityBuilderStore={cityBuilderStore} appStatusStore={appStatusStore}/>,
            document.getElementById(target)!
        );
    }

    private assertRequirementsAreMet() {
        if (!WebGLDetector.isWebGLSupported()) {
            const error = WebGLDetector.getWebGLErrorMessage();

            appStatusStore.error(
                new ErrorAction(App.WEBGL_ERROR_KEY, "WebGL is required. " + error, "Reload page", () => {
                    location.reload();
                })
            );
        }
    }
}
