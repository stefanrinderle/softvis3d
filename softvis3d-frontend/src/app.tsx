import * as React from "react";
import * as ReactDOM from "react-dom";
import Softvis3D from "./components/Softvis3D";
import LegacyConnector from "./legacy/LegacyConnector";
import appStatusStore from "./stores/AppStatusStore";
import cityBuilderStore from "./stores/CityBuilderStore";
import sceneStore from "./stores/SceneStore";
import SonarQubeMetricsService from "./services/sonarqube/SonarQubeMetricsService";
import SonarQubeLegacyService from "./services/sonarqube/SonarQubeLegacyService";

interface AppConfiguration {
    api: string;
    projectKey: string;
    isDev: boolean;
}

export default class App {
    private isInitialized: boolean;
    private communicator: SonarQubeMetricsService;
    private legacyService: SonarQubeLegacyService;
    private legacy: LegacyConnector;

    public constructor(config: AppConfiguration) {
        this.bootstrap(config);
    }

    public bootstrap(config: AppConfiguration) {
        this.isInitialized = false;
        this.communicator = new SonarQubeMetricsService(config.api, appStatusStore, cityBuilderStore);
        this.legacyService = new SonarQubeLegacyService(config.api, config.projectKey,
            appStatusStore, cityBuilderStore, sceneStore);
        this.legacy = new LegacyConnector(sceneStore, cityBuilderStore);
        appStatusStore.showLoadingQueue = config.isDev;
    }

    public init() {
        this.communicator.loadAvailableMetrics();
        this.isInitialized = true;
    }

    public run(target: string) {
        if (!this.isInitialized) {
            this.init();
        }

        cityBuilderStore.show = true;

        ReactDOM.render(
           <Softvis3D sceneStore={sceneStore} cityBuilderStore={cityBuilderStore} appStatusStore={appStatusStore}/>,
            document.getElementById(target)!
        );

    }
}
