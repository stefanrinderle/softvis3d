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
import { numberOfAuthorsBlameColorMetric } from "../../constants/Metrics";
import { lazyInject } from "../../inversify.config";
import AppStatusStore from "../../stores/AppStatusStore";
import CityBuilderStore from "../../stores/CityBuilderStore";
import SceneStore from "../../stores/SceneStore";
import SonarQubeScmService from "../sonarqube/SonarQubeScmService";
import LayoutProcessor from "./LayoutProcessor";
import Softvis3dModel from "./Softvis3dModel";

export default class CityLayoutService {
    public static BUILD_CITY: LoadAction = new LoadAction("BUILD_CITY", "Create layout");

    @lazyInject("AppStatusStore")
    private readonly appStatusStore!: AppStatusStore;
    @lazyInject("CityBuilderStore")
    private readonly cityBuilderStore!: CityBuilderStore;

    @lazyInject("LayoutProcessor")
    private readonly layoutProcessor!: LayoutProcessor;
    @lazyInject("SonarQubeScmService")
    private readonly scmService!: SonarQubeScmService;

    public createCity(sceneStore: SceneStore) {
        this.loadRequiredMetricData(sceneStore).then(() => {
            if (sceneStore.projectData !== null) {
                this.appStatusStore.load(CityLayoutService.BUILD_CITY);

                const model = this.prepareModel(sceneStore);
                this.buildCity(sceneStore, model);
            }
        });
    }

    private loadRequiredMetricData(sceneStore: SceneStore): Promise<void> {
        // Project data is already loaded. Otherwise multiple load
        // processes need to be chained here

        if (this.cityBuilderStore.options.metricColor.id === numberOfAuthorsBlameColorMetric.id) {
            return this.scmService.assertScmInfoAreLoaded(sceneStore);
        }

        return new Promise<void>((resolve) => {
            resolve();
        });
    }

    private prepareModel(sceneStore: SceneStore) {
        return new Softvis3dModel(
            sceneStore.projectData as TreeElement,
            this.cityBuilderStore.options.profile.footprintMetric.id,
            this.cityBuilderStore.options.profile.heightMetric.id,
            this.cityBuilderStore.options.metricColor.id,
            this.cityBuilderStore.options.buildingColorTheme
        );
    }

    private buildCity(sceneStore: SceneStore, model: Softvis3dModel) {
        const options = {
            layout: this.cityBuilderStore.options.layout.id,
            layoutOptions: {},
            colorMetric: this.cityBuilderStore.options.metricColor.id,
            scalingMethod: this.cityBuilderStore.options.profile.scale,
        };

        this.layoutProcessor.getIllustration(options, model).then((illustration) => {
            sceneStore.shapes = illustration.shapes;

            this.appStatusStore.loadComplete(CityLayoutService.BUILD_CITY);
        });
    }
}
