///
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
import {BackendService} from "../BackendService";
import {CityBuilderStore} from "../../../stores/CityBuilderStore";
import LoadAction from "../../../classes/status/LoadAction";
import ErrorAction from "../../../classes/status/ErrorAction";
import {noColorMetric, numberOfAuthorsBlameColorMetric, packageNameColorMetric} from "../../../constants/Metrics";
import {SceneStore} from "../../../stores/SceneStore";
import VisualizationOptions from "../../../classes/VisualizationOptions";
import {AppStatusStore} from "../../../stores/AppStatusStore";
import {TreeElement} from "../../../classes/TreeElement";
import {SonarVisualizationRequestParams} from "./SonarVisualizationRequestParams";
import {SonarQubeMeasurePagingResponse, SonarQubeMeasureResponse} from "./SonarQubeMeasureResponse";
import SonarQubeTransformer from "../SonarQubeTransformer";

export default class SonarQubeMeasuresService extends BackendService {
    public static LOAD_MEASURES: LoadAction = new LoadAction("SONAR_LOAD_MEASURES", "Request measures from SonarQube");
    private static LOAD_MEASURES_ERROR_KEY: string = "LOAD_MEASURES_ERROR";

    private projectKey: string;
    private appStatusStore: AppStatusStore;
    private cityBuilderStore: CityBuilderStore;
    private sceneStore: SceneStore;

    private currentParams: SonarVisualizationRequestParams;

    constructor(apiUrl: string, projectKey: string, appStatusStore: AppStatusStore,
                cityBuilderStore: CityBuilderStore, sceneStore: SceneStore) {
        super(apiUrl);

        this.projectKey = projectKey;
        this.appStatusStore = appStatusStore;
        this.cityBuilderStore = cityBuilderStore;
        this.sceneStore = sceneStore;
    }

    public loadMeasuresInitial(options: VisualizationOptions) {
        this.appStatusStore.load(SonarQubeMeasuresService.LOAD_MEASURES);

        this.sceneStore.options = options;
        this.sceneStore.shapes = null;

        // this.projectKey = "org.sonarsource.sonarqube:sonarqube";

        const params = new SonarVisualizationRequestParams(this.projectKey, this.getMetricRequestValues());

        if (this.currentParams && this.currentParams.equals(params)) {
            this.appStatusStore.loadComplete(SonarQubeMeasuresService.LOAD_MEASURES);
            this.sceneStore.legacyData = Object.assign({}, this.sceneStore.legacyData);
        } else {
            let t0 = performance.now();

            /**
             * Create a "starting point" root element and load the tree of the project.
             */
            let root: TreeElement = new TreeElement("", this.projectKey, {}, "", "", "PRJ");

            this.loadTree(root).then(() => {
                let t1 = performance.now();
                console.error("Call to took " + (t1 - t0) + " milliseconds.");

                this.appStatusStore.loadComplete(SonarQubeMeasuresService.LOAD_MEASURES);

                this.currentParams = params;
                this.sceneStore.scmMetricLoaded = false;
                this.sceneStore.legacyData = root;

                this.cityBuilderStore.show = false;
            }).catch((error) => {
                console.error(error);
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

    public loadTree(parent: TreeElement): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let metricKeys = this.getMetricRequestValues();

            /**
             * Load the direct children of the given component. In SQ terms this means only directories or sub-projects
             * will be loaded.
             */
            this.loadMeasures(parent.key, metricKeys, "children", "DIR,BRC").then((result) => {
                if (result.components.length === 0) {
                    resolve();
                }
                /**
                 * The result contains either only dirs or only sub-projects.
                 */
                if (result.components[0].qualifier === "DIR") {
                    /**
                     * Add each directory to the tree based on the current parent.
                     */
                    for (const component of result.components) {
                        // ignore the folder with just "/" because this is not needed.
                        if (component.path !== "/") {
                            this.addToParent(parent, SonarQubeTransformer.createTreeElement(component));
                        }
                    }
                    /**
                     * The files are still missing, so request them for the same key as the directories have been
                     * requested.
                     */
                    this.loadMeasures(parent.key, metricKeys, "all", "FIL").then((filesResult) => {
                        for (const file of filesResult.components) {
                            this.addToParentDescending(parent, SonarQubeTransformer.createTreeElement(file));
                        }
                        resolve();
                    }).catch(() => {
                        reject();
                    });
                } else if (result.components[0].qualifier === "BRC") {
                    /**
                     * For sub-projects, we do the following:
                     * 1. Create a TreeElement
                     * 2. Add the sub-project as child to the current node.
                     * 3. Load again with the sub-project as parent.
                     */
                    let requests: Array<Promise<void>> = [];
                    for (const subProject of result.components) {
                        let node: TreeElement = SonarQubeTransformer.createTreeElement(subProject);

                        if (parent) {
                            parent.children.push(node);
                        }

                        requests.push(this.loadTree(node));
                    }
                    Promise.all(requests).then(() => {
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    /**
     * Will be called with the path of the components sorted.
     */
    public addToParent(parent: TreeElement, element: TreeElement) {
        if (parent.children.length === 0) {
            parent.children.push(element);
        } else {
            for (const child of parent.children) {
                let indexOf = element.path.indexOf(child.path);
                if (indexOf === 0) {
                    this.addToParent(child, element);
                    return;
                }
            }
            parent.children.push(element);
        }

        element.parent = parent;
    }

    public addToParentDescending(parent: TreeElement, element: TreeElement) {
        if (parent.children.length === 0) {
            parent.children.push(element);
        } else {
            for (let _i = parent.children.length - 1; _i >= 0; _i--) {
                let child = parent.children[_i];
                let indexOf = element.path.indexOf(child.path);
                if (indexOf === 0) {
                    this.addToParentDescending(child, element);
                    return;
                }
            }
            parent.children.push(element);
        }

        element.parent = parent;
    }

    public loadMeasures(baseComponentKey: string, metricKeys: string, strategy: string, qualifiers: string,
                        page: number = 1): Promise<SonarQubeMeasureResponse> {
        return new Promise<SonarQubeMeasureResponse>((resolve, reject) => {
            const params = {
                baseComponentKey,
                p: page,
                metricKeys,
                strategy,
                qualifiers,
                s: "path",
                ps: 500
            };
            this.callApi("/measures/component_tree", {params}).then((response) => {
                let result: SonarQubeMeasurePagingResponse = response.data;
                let allResults: SonarQubeMeasureResponse = {
                    baseComponent: result.baseComponent,
                    components: result.components
                };

                const position = result.paging.pageIndex * result.paging.pageSize;
                if (position < result.paging.total) {
                    return this.loadMeasures(baseComponentKey, metricKeys, strategy, qualifiers, page + 1).then((resultSecond) => {
                        allResults.components.concat(resultSecond.components);
                        resolve(allResults);
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    resolve(allResults);
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    private getMetricRequestValues(): string {
        let result: Set<string> = new Set();
        result.add(this.cityBuilderStore.profile.footprintMetricId);
        result.add(this.cityBuilderStore.profile.heightMetricId);

        for (const colorMetric of this.cityBuilderStore.colorMetrics.keys) {
            if (colorMetric !== noColorMetric.id && colorMetric !== packageNameColorMetric.id
                && colorMetric !== numberOfAuthorsBlameColorMetric.id) {
                result.add(colorMetric);
            }
        }

        return Array.from(result).join(",");
    }
}