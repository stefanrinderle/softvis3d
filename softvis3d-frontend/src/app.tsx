import * as React from "react";
import * as ReactDOM from "react-dom";
import {AppConfiguration} from "./classes/AppConfiguration";
import ErrorAction from "./classes/status/ErrorAction";
import Softvis3D from "./components/Softvis3D";
import {container} from "./inversify.config";
import AppReactions from "./reactions/AppReactions";
import BuilderReactions from "./reactions/BuilderReactions";
import SceneReactions from "./reactions/SceneReactions";
import AutoReloadService from "./services/AutoReloadService";
import {CityLayoutService} from "./services/layout/CityLayoutService";
import SonarQubeMeasuresApiService from "./services/sonarqube/measures/SonarQubeMeasuresApiService";
import SonarQubeMeasuresMetricService from "./services/sonarqube/measures/SonarQubeMeasuresMetricService";
import SonarQubeMeasuresService from "./services/sonarqube/measures/SonarQubeMeasuresService";
import SonarQubeMeasuresTreeService from "./services/sonarqube/measures/SonarQubeMeasuresTreeService";
import SonarQubeOptimizeStructureService from "./services/sonarqube/measures/SonarQubeOptimizeStructureService";
import SonarQubeComponentInfoService from "./services/sonarqube/SonarQubeComponentInfoService";
import SonarQubeMetricsService from "./services/sonarqube/SonarQubeMetricsService";
import SonarQubeScmService from "./services/sonarqube/SonarQubeScmService";
import VisualizationLinkService from "./services/VisualizationLinkService";
import WebGLDetector from "./services/WebGLDetector";
import appStatusStore from "./stores/AppStatusStore";
import cityBuilderStore from "./stores/CityBuilderStore";
import sceneStore from "./stores/SceneStore";

export default class App {
    private static WEBGL_ERROR_KEY: string = "WEBGL_ERROR";

    private communicator: SonarQubeMetricsService;
    private visualizationLinkService: VisualizationLinkService;
    private componentInfoService: SonarQubeComponentInfoService;

    private config: AppConfiguration;

    // @ts-ignore: unused variable
    private reactions: any[];

    public constructor(config: AppConfiguration) {
        this.config = config;
        appStatusStore.showLoadingQueue = this.config.isDev;

        this.visualizationLinkService = new VisualizationLinkService(this.config, cityBuilderStore, sceneStore);
        container.bind<VisualizationLinkService>("VisualizationLinkService")
            .toConstantValue(this.visualizationLinkService);

        this.communicator = new SonarQubeMetricsService(appStatusStore, cityBuilderStore, this.config.baseUrl);

        container.bind<SonarQubeMetricsService>("SonarQubeMetricsService")
            .toConstantValue(this.communicator);

        container.bind<SonarQubeScmService>("SonarQubeScmService")
            .toConstantValue(new SonarQubeScmService(appStatusStore, sceneStore));
        container.bind<SonarQubeMeasuresApiService>("SonarQubeMeasuresApiService")
            .toConstantValue(new SonarQubeMeasuresApiService(config, appStatusStore));
        container.bind<SonarQubeMeasuresTreeService>("SonarQubeMeasuresTreeService")
            .toConstantValue(new SonarQubeMeasuresTreeService());
        container.bind<SonarQubeMeasuresMetricService>("SonarQubeMeasuresMetricService")
            .toConstantValue(new SonarQubeMeasuresMetricService(cityBuilderStore));
        let measuresService = new SonarQubeMeasuresService(config.projectKey, appStatusStore, cityBuilderStore, sceneStore);
        container.bind<SonarQubeMeasuresService>("SonarQubeMeasuresService")
            .toConstantValue(measuresService);
        container.bind<SonarQubeOptimizeStructureService>("SonarQubeOptimizeStructureService")
            .toConstantValue(new SonarQubeOptimizeStructureService());

        container.bind<CityLayoutService>("CityLayoutService")
            .toConstantValue(new CityLayoutService(sceneStore, appStatusStore));

        container.bind<AutoReloadService>("AutoReloadService")
            .toConstantValue(new AutoReloadService(appStatusStore));
        this.componentInfoService = new SonarQubeComponentInfoService(this.config.projectKey, this.config.baseUrl);
        container.bind<SonarQubeComponentInfoService>("SonarQubeComponentInfoService")
            .toConstantValue(this.componentInfoService);

        this.reactions = [
            new AppReactions(appStatusStore, cityBuilderStore),
            new SceneReactions(sceneStore, cityBuilderStore),
            new BuilderReactions(cityBuilderStore)
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
                       baseUrl={this.config.baseUrl}/>,
            document.getElementById(target)!
        );
    }

    public stop(target: string) {
        const element = document.getElementById(target);
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
