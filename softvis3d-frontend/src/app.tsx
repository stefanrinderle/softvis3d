import * as React from "react";
import * as ReactDOM from "react-dom";
import Softvis3D from "./components/Softvis3D";
import LegacyConnector from "./legacy/LegacyConnector";
import appStatusStore from "./stores/AppStatusStore";
import cityBuilderStore from "./stores/CityBuilderStore";
import sceneStore from "./stores/SceneStore";
import SonarQubeMetricsService from "./services/sonarqube/SonarQubeMetricsService";
import SonarQubeLegacyService from "./services/sonarqube/SonarQubeLegacyService";
import WebGLDetector from "./services/WebGLDetector";
import SceneReactions from "./reactions/SceneReactions";
import BuilderReactions from "./reactions/BuilderReactions";
import ErrorAction from "./classes/status/ErrorAction";
import VisualizationLinkService from "./services/VisualizationLinkService";

export interface AppConfiguration {
    api: string;
    projectKey: string;
    isDev: boolean;
}

export default class App {
    private static WEBGL_ERROR_KEY: string = "WEBGL_ERROR";

    private communicator: SonarQubeMetricsService;
    private legacyService: SonarQubeLegacyService;
    private visualizationLinkService: VisualizationLinkService;
    private legacy: LegacyConnector;
    //noinspection JSMismatchedCollectionQueryUpdate
    private reactions: any[] = [];

    public constructor(config: AppConfiguration) {
        appStatusStore.showLoadingQueue = config.isDev;

        this.visualizationLinkService = new VisualizationLinkService(cityBuilderStore);
        this.communicator =
            new SonarQubeMetricsService(config.api, appStatusStore, cityBuilderStore);
        this.legacyService =
            new SonarQubeLegacyService(config.api, config.projectKey, appStatusStore, cityBuilderStore, sceneStore);
        this.legacy = new LegacyConnector(sceneStore, cityBuilderStore, appStatusStore);

        this.reactions.push(new SceneReactions(sceneStore, cityBuilderStore, appStatusStore, this.legacy, this.legacyService));
        this.reactions.push(new BuilderReactions(cityBuilderStore, sceneStore));
    }

    public run(target: string) {
        this.communicator.loadAvailableMetrics().then(() => {
            this.visualizationLinkService.process(document.location.search);
        });

        this.assertRequirementsAreMet();

        ReactDOM.render(
           <Softvis3D sceneStore={sceneStore} cityBuilderStore={cityBuilderStore} appStatusStore={appStatusStore}
                      visualizationLinkService={this.visualizationLinkService}/>,
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
