///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppConfiguration } from "./classes/AppConfiguration";
import ErrorAction from "./classes/status/ErrorAction";
import VisualizationLinkSerializationService from "./classes/VisualizationLinkSerializationService";
import Softvis3D from "./components/Softvis3D";
import { bindToInjection, container } from "./inversify.config";
import AppReactions from "./reactions/AppReactions";
import BuilderReactions from "./reactions/BuilderReactions";
import SceneReactions from "./reactions/SceneReactions";
import AutoReloadService from "./services/AutoReloadService";
import { HtmlDomService } from "./services/HtmlDomService";
import CityLayoutService from "./services/layout/CityLayoutService";
import SelectedElementService from "./services/SelectedElementService";
import SonarQubeMeasuresApiService from "./services/sonarqube/measures/api/SonarQubeMeasuresApiService";
import SonarQubeMeasuresTreeService from "./services/sonarqube/measures/api/SonarQubeMeasuresTreeService";
import SonarQubeTransformerService from "./services/sonarqube/measures/api/SonarQubeTransformerService";
import SonarQubeMeasuresMetricService from "./services/sonarqube/measures/SonarQubeMeasuresMetricService";
import SonarQubeMeasuresService from "./services/sonarqube/measures/SonarQubeMeasuresService";
import SonarQubeFilterStructureService from "./services/sonarqube/measures/structure/SonarQubeFilterStructureService";
import SonarQubeOptimizeStructureService from "./services/sonarqube/measures/structure/SonarQubeOptimizeStructureService";
import ScmCalculatorService from "./services/sonarqube/ScmCalculatorService";
import SonarQubeComponentInfoService from "./services/sonarqube/SonarQubeComponentInfoService";
import SonarQubeMetricsService from "./services/sonarqube/SonarQubeMetricsService";
import SonarQubeScmService from "./services/sonarqube/SonarQubeScmService";
import TreeService from "./services/TreeService";
import UrlParameterService from "./services/UrlParameterService";
import VisualizationLinkService from "./services/VisualizationLinkService";
import WebGLDetectorService from "./services/WebGLDetectorService";
import AppStatusStore from "./stores/AppStatusStore";
import CityBuilderStore from "./stores/CityBuilderStore";
import SceneStore from "./stores/SceneStore";

export default class App {
    private static WEBGL_ERROR_KEY = "WEBGL_ERROR";

    private readonly communicator: SonarQubeMetricsService;
    private readonly visualizationLinkService: VisualizationLinkService;
    private readonly componentInfoService: SonarQubeComponentInfoService;
    private webGLDetectorService: WebGLDetectorService;

    private readonly config: AppConfiguration;

    private readonly appStatusStore: AppStatusStore;

    public constructor(config: AppConfiguration) {
        this.config = config;

        this.appStatusStore = new AppStatusStore();
        this.appStatusStore.showLoadingQueue = this.config.isDev;
        container.bind<AppStatusStore>("AppStatusStore").toConstantValue(this.appStatusStore);

        bindToInjection(CityBuilderStore);
        bindToInjection(SceneStore);
        bindToInjection(SelectedElementService);

        this.visualizationLinkService = new VisualizationLinkService(this.config);
        container
            .bind<VisualizationLinkService>("VisualizationLinkService")
            .toConstantValue(this.visualizationLinkService);

        container
            .bind<SonarQubeScmService>("SonarQubeScmService")
            .toConstantValue(new SonarQubeScmService(this.config.baseUrl));
        container
            .bind<SonarQubeMeasuresApiService>("SonarQubeMeasuresApiService")
            .toConstantValue(new SonarQubeMeasuresApiService(config));
        bindToInjection(SonarQubeMeasuresMetricService);
        const measuresService = new SonarQubeMeasuresService(config.projectKey);
        container
            .bind<SonarQubeMeasuresService>("SonarQubeMeasuresService")
            .toConstantValue(measuresService);

        this.communicator = new SonarQubeMetricsService(this.config.baseUrl);
        container
            .bind<SonarQubeMetricsService>("SonarQubeMetricsService")
            .toConstantValue(this.communicator);

        this.webGLDetectorService = bindToInjection(WebGLDetectorService);
        bindToInjection(UrlParameterService);
        bindToInjection(SonarQubeOptimizeStructureService);
        bindToInjection(SonarQubeMeasuresTreeService);
        bindToInjection(HtmlDomService);
        bindToInjection(SonarQubeTransformerService);
        bindToInjection(ScmCalculatorService);
        bindToInjection(CityLayoutService);
        bindToInjection(TreeService);
        bindToInjection(AutoReloadService);
        bindToInjection(SonarQubeFilterStructureService);
        bindToInjection(VisualizationLinkSerializationService);

        this.componentInfoService = new SonarQubeComponentInfoService(
            this.config.projectKey,
            this.config.baseUrl
        );
        container
            .bind<SonarQubeComponentInfoService>("SonarQubeComponentInfoService")
            .toConstantValue(this.componentInfoService);

        const reactions = [new AppReactions(), new SceneReactions(), new BuilderReactions()];
        if (reactions.length === 0) {
            // only to use the variable.
        }
    }

    public run(target: string) {
        this.communicator.loadAvailableMetrics().then(() => {
            this.visualizationLinkService.process(document.location.search);
        });

        this.loadComponentInfoData();
        this.assertClientRequirementsAreMet();

        ReactDOM.render(
            <Softvis3D baseUrl={this.config.baseUrl} />,
            document.getElementById(target)
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
        this.componentInfoService
            .loadComponentInfo()
            .then((result) => {
                this.appStatusStore.analysisDate = result.analysisDate;
            })
            .catch(() => {
                this.appStatusStore.analysisDate = undefined;
            });
    }

    private assertClientRequirementsAreMet() {
        if (!this.webGLDetectorService.isWebGLSupported()) {
            const error = this.webGLDetectorService.getWebGLErrorMessage();

            this.appStatusStore.error(
                new ErrorAction(
                    App.WEBGL_ERROR_KEY,
                    "WebGL is required. " + error,
                    "Reload page",
                    () => {
                        location.reload();
                    }
                )
            );
        }
    }
}
