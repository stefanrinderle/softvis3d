///
import {injectable} from "inversify";
import ErrorAction from "../../../classes/status/ErrorAction";
import LoadAction from "../../../classes/status/LoadAction";
import {TreeElement} from "../../../classes/TreeElement";
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
import {SQ_QUALIFIER_PROJECT} from "./api/SonarQubeMeasureResponse";
import SonarQubeMeasuresTreeService from "./api/SonarQubeMeasuresTreeService";
import SonarQubeMeasuresMetricService from "./SonarQubeMeasuresMetricService";
import SonarQubeFilterStructureService from "./structure/SonarQubeFilterStructureService";
import SonarQubeOptimizeStructureService from "./structure/SonarQubeOptimizeStructureService";

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
    @lazyInject("SonarQubeFilterStructureService")
    private readonly filterStructureService!: SonarQubeFilterStructureService;

    private metricKeys?: string;
    private projectData?: TreeElement | null = null;

    constructor(projectKey: string) {
        this.projectKey = projectKey;
    }

    public loadMeasures(appStatusStore: AppStatusStore,
                        cityBuilderStore: CityBuilderStore, sceneStore: SceneStore,
                        isForce: boolean = false) {
        appStatusStore.load(SonarQubeMeasuresService.LOAD_MEASURES);

        sceneStore.shapes = null;

        const metricKeys = this.measureMetricService.getMetricRequestValues(cityBuilderStore);

        if (!isForce && this.projectData && this.metricKeys && this.metricKeys === metricKeys) {
            this.updateViewProjectData(this.projectData, cityBuilderStore, sceneStore);
        } else {
            /**
             * Create a "starting point" root element and load the tree of the project.
             */
            let root: TreeElement =
                new TreeElement(this.projectKey, this.projectKey, {}, this.projectKey, this.projectKey, SQ_QUALIFIER_PROJECT);

            this.measureTreeService.loadTree(appStatusStore, root, metricKeys).then(() => {
                // save current data
                this.projectData = root.clone();
                this.metricKeys = metricKeys;

                this.updateViewProjectData(root, cityBuilderStore, sceneStore);

                sceneStore.scmMetricLoaded = false;
                cityBuilderStore.show = false;
            }).catch(() => {
                appStatusStore.error(
                    new ErrorAction(SonarQubeMeasuresService.LOAD_MEASURES_ERROR_KEY,
                        "SonarQube metric API is not available or responding: ",
                        "Try again", () => {
                            location.reload();
                        }));
            });
        }
        appStatusStore.loadComplete(SonarQubeMeasuresService.LOAD_MEASURES);
    }

    private updateViewProjectData(root: TreeElement, cityBuilderStore: CityBuilderStore, sceneStore: SceneStore) {
        const projectData: TreeElement = root.clone();
        this.filterStructureService.optimize(projectData, cityBuilderStore.options.testClassesVariant);
        this.optimizeStructureService.optimize(projectData);

        sceneStore.projectData = projectData;
    }
}