///
import {injectable} from "inversify";
import ErrorAction from "../../../classes/status/ErrorAction";
import LoadAction from "../../../classes/status/LoadAction";
import {TreeElement} from "../../../classes/TreeElement";
import VisualizationOptions from "../../../classes/VisualizationOptions";
import {lazyInject} from "../../../inversify.config";
import {AppStatusStore} from "../../../stores/AppStatusStore";
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
import {CityBuilderStore} from "../../../stores/CityBuilderStore";
import {SceneStore} from "../../../stores/SceneStore";
import SonarQubeMeasuresMetricService from "./SonarQubeMeasuresMetricService";
import SonarQubeMeasuresTreeService from "./SonarQubeMeasuresTreeService";
import SonarQubeOptimizeStructureService from "./SonarQubeOptimizeStructureService";

@injectable()
export default class SonarQubeMeasuresService {
    public static LOAD_MEASURES: LoadAction = new LoadAction("SONAR_LOAD_MEASURES", "Request measures from SonarQube");
    private static LOAD_MEASURES_ERROR_KEY: string = "LOAD_MEASURES_ERROR";

    private projectKey: string;
    private appStatusStore: AppStatusStore;
    private cityBuilderStore: CityBuilderStore;
    private sceneStore: SceneStore;

    @lazyInject("SonarQubeMeasuresTreeService")
    private readonly measureTreeService!: SonarQubeMeasuresTreeService;
    @lazyInject("SonarQubeMeasuresMetricService")
    private readonly measureMetricService!: SonarQubeMeasuresMetricService;
    @lazyInject("SonarQubeOptimizeStructureService")
    private readonly optimizeStructureService!: SonarQubeOptimizeStructureService;

    private metricKeys?: string;

    constructor(projectKey: string, appStatusStore: AppStatusStore,
                cityBuilderStore: CityBuilderStore, sceneStore: SceneStore) {
        this.projectKey = projectKey;
        this.appStatusStore = appStatusStore;
        this.cityBuilderStore = cityBuilderStore;
        this.sceneStore = sceneStore;
    }

    public loadMeasures(options: VisualizationOptions, isForce: boolean = false) {
        this.appStatusStore.load(SonarQubeMeasuresService.LOAD_MEASURES);

        this.sceneStore.options = options;
        this.sceneStore.shapes = null;

        let metricKeys = this.measureMetricService.getMetricRequestValues();

        if (!isForce && this.metricKeys && this.metricKeys === metricKeys) {
            this.appStatusStore.loadComplete(SonarQubeMeasuresService.LOAD_MEASURES);
            this.sceneStore.projectData = Object.assign({}, this.sceneStore.projectData);
        } else {
            /**
             * Create a "starting point" root element and load the tree of the project.
             */
            let root: TreeElement =
                new TreeElement(this.projectKey, this.projectKey, {}, this.projectKey, this.projectKey, false);

            this.measureTreeService.loadTree(root, metricKeys).then(() => {
                this.optimizeStructureService.optimize(root);

                this.appStatusStore.loadComplete(SonarQubeMeasuresService.LOAD_MEASURES);

                this.metricKeys = metricKeys;
                this.sceneStore.scmMetricLoaded = false;
                this.sceneStore.projectData = root;

                this.cityBuilderStore.show = false;
            }).catch(() => {
                this.appStatusStore.error(
                    new ErrorAction(SonarQubeMeasuresService.LOAD_MEASURES_ERROR_KEY,
                        "SonarQube metric API is not available or responding: ",
                        "Try again", () => {
                            location.reload();
                        }));
                this.appStatusStore.loadComplete(SonarQubeMeasuresService.LOAD_MEASURES);
            });
        }
    }

}