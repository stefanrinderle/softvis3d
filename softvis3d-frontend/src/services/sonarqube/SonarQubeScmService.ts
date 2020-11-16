///
import ErrorAction from "../../classes/status/ErrorAction";
import LoadAction from "../../classes/status/LoadAction";
import {TreeElement} from "../../classes/TreeElement";
import {lazyInject} from "../../inversify.config";
import AppStatusStore from "../../stores/AppStatusStore";
import SceneStore from "../../stores/SceneStore";
import TreeService from "../TreeService";
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
import {BackendService} from "./BackendService";
import ScmCalculatorService from "./ScmCalculatorService";

export default class SonarQubeScmService extends BackendService {
    public static LOAD_SCM: LoadAction = new LoadAction("SONAR_LOAD_SCM", "Request scm infos from SonarQube");
    public static STATUS_SCM_NOT_AVAILABLE: LoadAction = new LoadAction("STATUS_SCM_NOT_AVAILABLE",
        "SCM blame info is not available. Please check your scm plugin.");
    private static LOAD_SCM_ERROR_KEY: string = "LOAD_SCM_ERROR";

    @lazyInject("TreeService")
    private readonly treeService!: TreeService;
    @lazyInject("ScmCalculatorService")
    private readonly scmCalculator!: ScmCalculatorService;

    constructor(baseUrl?: string) {
        super(baseUrl);
    }

    public assertScmInfoAreLoaded(appStatusStore: AppStatusStore, sceneStore: SceneStore): Promise<void> {
        return new Promise<void>((resolve) => {
            if (sceneStore.scmMetricLoaded) {
                resolve();
                return;
            }

            this.loadScmInfosIfAvailable(appStatusStore, sceneStore).then(() => {
                sceneStore.scmMetricLoaded = true;
                resolve();
            });
        });
    }

    public checkScmInfosAvailable(appStatusStore: AppStatusStore, sceneStore: SceneStore): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (sceneStore.projectData !== null) {
                let allFiles: TreeElement[] = this.treeService.getAllFiles(sceneStore.projectData);
                allFiles = allFiles.slice(0, 10);

                let requests: Array<Promise<void>> = [];
                for (let file of allFiles) {
                    requests.push(this.loadScmInfosFor(appStatusStore, file));
                }

                Promise.all(requests).then(() => {
                    let isScmMetricAvailable = this.checkScmMetricAvailable(allFiles);
                    if (!isScmMetricAvailable) {
                        appStatusStore.status(SonarQubeScmService.STATUS_SCM_NOT_AVAILABLE);
                    }
                    resolve(isScmMetricAvailable);
                }).catch(() => {
                    reject();
                });
            } else {
                resolve(false);
            }
        });
    }

    public loadScmInfos(appStatusStore: AppStatusStore, sceneStore: SceneStore): Promise<void> {
        appStatusStore.load(SonarQubeScmService.LOAD_SCM);

        return new Promise<void>((resolve, reject) => {
            if (sceneStore.projectData !== null) {
                let allFiles: TreeElement[] = this.treeService.getAllFiles(sceneStore.projectData);

                this.loadScmInfosBatch(appStatusStore, allFiles).then(() => {
                    appStatusStore.loadComplete(SonarQubeScmService.LOAD_SCM);
                    resolve();
                }).catch(() => {
                    reject();
                });
            } else {
                resolve();
            }
        });
    }

    private loadScmInfosIfAvailable(appStatusStore: AppStatusStore, sceneStore: SceneStore): Promise<void> {
        return new Promise<void>((resolve) => {
            this.checkScmInfosAvailable(appStatusStore, sceneStore).then((isAvailable: boolean) => {
                if (isAvailable) {
                    this.loadScmInfos(appStatusStore, sceneStore).then(() => resolve());
                } else {
                    resolve();
                }
            });
        });
    }

    private checkScmMetricAvailable(allFiles: TreeElement[]): boolean {
        for (let file of allFiles) {
            if (file.measures.number_of_authors > 0) {
                return true;
            }
        }
        return false;
    }

    private loadScmInfosBatch(appStatusStore: AppStatusStore, allFiles: TreeElement[], page: number = 0): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let pageSize: number = 75;
            // example 146 / 75 = 1,94 => 1 => +1 => 2
            let pagesMax = Math.floor(allFiles.length / pageSize) + 1;
            appStatusStore.loadStatusUpdate(SonarQubeScmService.LOAD_SCM.key, pagesMax, page);

            let requests: Array<Promise<void>> = [];

            let start: number = page * pageSize;
            let end: number = (page * pageSize) + pageSize;

            if (allFiles.length < end) {
                end = allFiles.length;
            }

            for (let i = start; i < end; i++) {
                requests.push(this.loadScmInfosFor(appStatusStore, allFiles[i]));
            }

            Promise.all(requests).then(() => {
                let isNextBatchRequired: boolean = allFiles.length > (page * pageSize) + pageSize;
                if (isNextBatchRequired) {
                    this.loadScmInfosBatch(appStatusStore, allFiles, page + 1).then(() => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            }).catch(() => {
                reject();
            });
        });
    }

    private loadScmInfosFor(appStatusStore: AppStatusStore, element: TreeElement): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const params = {key: element.key};
            this.callApi("/sources/scm", {params}).then((response) => {
                let metrics = (response.data.scm)
                    .map((c: any) => {
                            return this.scmCalculator.createMetric(c);
                        }
                    );

                element.measures = Object.assign(element.measures, {
                    number_of_authors: this.scmCalculator.calcNumberOfAuthors(metrics)
                });

                resolve();
            }).catch((error) => {
                appStatusStore.error(
                    new ErrorAction(SonarQubeScmService.LOAD_SCM_ERROR_KEY,
                        "SonarQube metric API is not available or responding: " + error.response.statusText,
                        "Try again", () => {
                            location.reload();
                        }));
                appStatusStore.loadComplete(SonarQubeScmService.LOAD_SCM);
                reject();
            });
        });
    }

}