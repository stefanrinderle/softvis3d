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

import LoadAction from "../../classes/status/LoadAction";
import { TreeElement } from "../../classes/TreeElement";
import { ColorMetrics } from "../../constants/ColorMetrics";
import { lazyInject } from "../../inversify.config";
import AppStatusStore from "../../stores/AppStatusStore";
import SceneStore from "../../stores/SceneStore";
import VisualizationOptionStore from "../../stores/VisualizationOptionStore";
import SonarQubeScmService from "../sonarqube/SonarQubeScmService";
import LayoutProcessor from "./LayoutProcessor";
import Softvis3dModel from "./Softvis3dModel";

export default class CityLayoutService {
    public static BUILD_CITY: LoadAction = new LoadAction("BUILD_CITY", "Create layout");

    @lazyInject("SceneStore")
    private readonly sceneStore!: SceneStore;
    @lazyInject("AppStatusStore")
    private readonly appStatusStore!: AppStatusStore;
    @lazyInject("VisualizationOptionStore")
    private readonly visualizationOptions!: VisualizationOptionStore;

    @lazyInject("LayoutProcessor")
    private readonly layoutProcessor!: LayoutProcessor;
    @lazyInject("SonarQubeScmService")
    private readonly scmService!: SonarQubeScmService;

    public createCity() {
        this.loadRequiredMetricData().then(() => {
            if (this.sceneStore.projectData !== null) {
                this.appStatusStore.load(CityLayoutService.BUILD_CITY);

                const model = this.prepareModel();
                this.buildCity(model);
            }
        });
    }

    private loadRequiredMetricData(): Promise<void> {
        // Project data is already loaded. Otherwise multiple load
        // processes need to be chained here

        if (ColorMetrics.isScmColorMetric(this.visualizationOptions.metricColor)) {
            return this.scmService.assertScmInfoAreLoaded();
        }

        return new Promise<void>((resolve) => {
            resolve();
        });
    }

    private prepareModel() {
        return new Softvis3dModel(
            this.sceneStore.projectData as TreeElement,
            this.visualizationOptions.profile.footprintMetric.id,
            this.visualizationOptions.profile.heightMetric.id,
            this.visualizationOptions.metricColor.id,
            this.visualizationOptions.buildingColorTheme
        );
    }

    private buildCity(model: Softvis3dModel) {
        const options = {
            layout: this.visualizationOptions.layout.id,
            layoutOptions: {},
            colorMetric: this.visualizationOptions.metricColor.id,
            scalingMethod: this.visualizationOptions.profile.scale,
        };

        this.layoutProcessor.getIllustration(options, model).then((illustration) => {
            this.sceneStore.shapes = illustration.shapes;

            this.appStatusStore.loadComplete(CityLayoutService.BUILD_CITY);
        });
    }
}
