import * as React from "react";
import * as ReactDOM from "react-dom";
import Softvis3D from "./components/Softvis3D";
import LegacyConnector from "./legacy/LegacyConnector";
import appStatusStore from "./stores/AppStatusStore";
import cityBuilderStore from "./stores/CityBuilderStore";
import sceneStore from "./stores/SceneStore";
import SonarQubeMetricsService from "./services/sonarqube/SonarQubeMetricsService";
import SonarQubeLegacyService from "./services/sonarqube/SonarQubeLegacyService";
import SceneReactions from "./reactions/SceneReactions";
import BuilderReactions from "./reactions/BuilderReactions";
import {WebGLDetector} from "./components/scene/webgl/WebGLDetector";

interface AppConfiguration {
    api: string;
    projectKey: string;
    isDev: boolean;
}

export default class App {
    private isInitialized: boolean = false;
    private communicator: SonarQubeMetricsService;
    private legacyService: SonarQubeLegacyService;
    private legacy: LegacyConnector;
    //noinspection JSMismatchedCollectionQueryUpdate
    private reactions: any[];

    public constructor(config: AppConfiguration) {
        this.bootstrap(config);
    }

    public bootstrap(config: AppConfiguration) {
        appStatusStore.showLoadingQueue = config.isDev;
        this.communicator = new SonarQubeMetricsService(config.api, appStatusStore, cityBuilderStore);
        this.legacyService = new SonarQubeLegacyService(config.api, config.projectKey, appStatusStore, cityBuilderStore, sceneStore);
        this.legacy = new LegacyConnector(sceneStore, cityBuilderStore);
        this.reactions = [];
    }

    public init() {
        this.reactions.push(new SceneReactions(sceneStore, cityBuilderStore, this.legacy, this.legacyService));
        this.reactions.push(new BuilderReactions(cityBuilderStore, sceneStore));
        this.communicator.loadAvailableMetrics();
        this.isInitialized = true;
    }

    public run(target: string) {
        if (!this.isInitialized) {
            this.init();
        }

        this.assertRequirementsAreMet();

        cityBuilderStore.show = true;

        ReactDOM.render(
           <Softvis3D sceneStore={sceneStore} cityBuilderStore={cityBuilderStore} appStatusStore={appStatusStore}/>,
            document.getElementById(target)!
        );
    }

    private assertRequirementsAreMet() {
        if (!WebGLDetector.isWebGLSupported()) {
            console.warn(WebGLDetector.getWebGLErrorMessage());
            throw "WebGL has not been detected.";
        }
    }
}
