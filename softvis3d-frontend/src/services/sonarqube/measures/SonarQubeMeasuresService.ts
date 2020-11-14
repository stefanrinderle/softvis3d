///
import {injectable} from "inversify";
import ErrorAction from "../../../classes/status/ErrorAction";
import LoadAction from "../../../classes/status/LoadAction";
import {TreeElement} from "../../../classes/TreeElement";
import VisualizationOptions from "../../../classes/VisualizationOptions";
import {lazyInject} from "../../../inversify.config";
import AppStatusStore from "../../../stores/AppStatusStore";
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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
import CityBuilderStore from "../../../stores/CityBuilderStore";
import SceneStore from "../../../stores/SceneStore";
import SonarQubeMeasuresMetricService from "./SonarQubeMeasuresMetricService";
import SonarQubeMeasuresTreeService from "./SonarQubeMeasuresTreeService";
import SonarQubeOptimizeStructureService from "./SonarQubeOptimizeStructureService";

@injectable()
export default class SonarQubeMeasuresService {
    public static LOAD_MEASURES: LoadAction = new LoadAction("SONAR_LOAD_MEASURES", "Request measures from SonarQube");
    private static LOAD_MEASURES_ERROR_KEY: string = "LOAD_MEASURES_ERROR";

    private projectKey: string;

    @lazyInject("SonarQubeMeasuresTreeService")
    private readonly measureTreeService!: SonarQubeMeasuresTreeService;
    @lazyInject("SonarQubeMeasuresMetricService")
    private readonly measureMetricService!: SonarQubeMeasuresMetricService;
    @lazyInject("SonarQubeOptimizeStructureService")
    private readonly optimizeStructureService!: SonarQubeOptimizeStructureService;

    private metricKeys?: string;

    constructor(projectKey: string) {
        this.projectKey = projectKey;
    }

    public loadMeasures(appStatusStore: AppStatusStore,
                        cityBuilderStore: CityBuilderStore, sceneStore: SceneStore,
                        options: VisualizationOptions, isForce: boolean = false) {
        appStatusStore.load(SonarQubeMeasuresService.LOAD_MEASURES);

        sceneStore.options = options;
        sceneStore.shapes = null;

        let metricKeys = this.measureMetricService.getMetricRequestValues(cityBuilderStore);

        if (!isForce && this.metricKeys && this.metricKeys === metricKeys) {
            appStatusStore.loadComplete(SonarQubeMeasuresService.LOAD_MEASURES);
            sceneStore.projectData = Object.assign({}, sceneStore.projectData);
        } else {
            /**
             * Create a "starting point" root element and load the tree of the project.
             */
            let root: TreeElement =
                new TreeElement(this.projectKey, this.projectKey, {}, this.projectKey, this.projectKey, false);

            this.measureTreeService.loadTree(appStatusStore, root, metricKeys).then(() => {
                this.optimizeStructureService.optimize(root);

                appStatusStore.loadComplete(SonarQubeMeasuresService.LOAD_MEASURES);

                this.metricKeys = metricKeys;
                sceneStore.scmMetricLoaded = false;
                sceneStore.projectData = root;

                cityBuilderStore.show = false;
            }).catch(() => {
                appStatusStore.error(
                    new ErrorAction(SonarQubeMeasuresService.LOAD_MEASURES_ERROR_KEY,
                        "SonarQube metric API is not available or responding: ",
                        "Try again", () => {
                            location.reload();
                        }));
                appStatusStore.loadComplete(SonarQubeMeasuresService.LOAD_MEASURES);
            });
        }
    }

}