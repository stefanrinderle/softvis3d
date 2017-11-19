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
import { CityLayoutService } from "./services/layout/CityLayoutService";
import { AppConfiguration } from "./classes/AppConfiguration";
import SonarQubeComponentInfoService from "./services/sonarqube/SonarQubeComponentInfoService";
import AutoReloadService from "./services/AutoReloadService";
import AppReactions from "./reactions/AppReactions";

export default class App {
    private static WEBGL_ERROR_KEY: string = "WEBGL_ERROR";

    private communicator: SonarQubeMetricsService;
    private visualizationLinkService: VisualizationLinkService;
    private cityLayoutService: CityLayoutService;
    private componentInfoService: SonarQubeComponentInfoService;

    private config: AppConfiguration;

    // @ts-ignore: unused variable
    private reactions: any[];

    public constructor(config: AppConfiguration) {
        this.config = config;
        appStatusStore.showLoadingQueue = this.config.isDev;

        this.visualizationLinkService = new VisualizationLinkService(this.config, cityBuilderStore, sceneStore);
        this.communicator = new SonarQubeMetricsService(appStatusStore, cityBuilderStore, this.config.baseUrl);

        this.componentInfoService = new SonarQubeComponentInfoService(this.config.projectKey, this.config.baseUrl);
        let autoReloadService = new AutoReloadService(appStatusStore, this.componentInfoService);

        let scmService = new SonarQubeScmService(appStatusStore, sceneStore, this.config.baseUrl);
        let measuresApiService = new SonarQubeMeasuresApiService(this.config);
        let measuresTreeService = new SonarQubeMeasuresTreeService(appStatusStore, measuresApiService);
        let measuresMetricService = new SonarQubeMeasuresMetricService(cityBuilderStore);
        let measuresService = new SonarQubeMeasuresService(this.config.projectKey, measuresTreeService, measuresMetricService,
            appStatusStore, cityBuilderStore, sceneStore);
        this.cityLayoutService = new CityLayoutService(sceneStore, appStatusStore, scmService);

        this.reactions = [
            new AppReactions(appStatusStore, cityBuilderStore, measuresService, autoReloadService),
            new SceneReactions(sceneStore, cityBuilderStore, this.cityLayoutService),
            new BuilderReactions(cityBuilderStore, measuresService, autoReloadService)
        ];
    }

    public run(target: string) {
        this.communicator.loadAvailableMetrics().then(() => {
            this.visualizationLinkService.process(document.location.search);
        });

        this.loadComponentInfoData();
        this.assertClientRequirementsAreMet();

        ReactDOM.render(
            <Softvis3D sceneStore={sceneStore} cityBuilderStore={cityBuilderStore} appStatusStore={appStatusStore}
                       visualizationLinkService={this.visualizationLinkService} baseUrl={this.config.baseUrl}/>,
            document.getElementById(target)!
        );
    }

    public stop(target: string) {
        let element = document.getElementById(target);
        if (element) {
            ReactDOM.unmountComponentAtNode(element);
        } else {
            throw Error("Target element id " + target + "not found");
        }
    }

    private loadComponentInfoData() {
        this.componentInfoService.loadComponentInfo().then((result) => {
            appStatusStore.analysisDate = result.analysisDate;
        }).catch(() => {
            appStatusStore.analysisDate = undefined;
        });
    }

    private assertClientRequirementsAreMet() {
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
