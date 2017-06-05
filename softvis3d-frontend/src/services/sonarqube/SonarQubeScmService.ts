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
import {BackendService} from "./BackendService";
import {AppStatusStore} from "../../stores/AppStatusStore";
import LoadAction from "../../classes/status/LoadAction";
import ErrorAction from "../../classes/status/ErrorAction";
import {default as sceneStore, SceneStore} from "../../stores/SceneStore";
import {TreeService} from "../TreeService";
import ScmCalculator from "./ScmCalculator";
import {TreeElement} from "../../classes/TreeElement";

export default class SonarQubeScmService extends BackendService {
    public static LOAD_SCM: LoadAction = new LoadAction("SONAR_LOAD_SCM", "Request scm infos from SonarQube");
    public static STATUS_SCM_NOT_AVAILABLE: LoadAction = new LoadAction("STATUS_SCM_NOT_AVAILABLE",
        "SCM blame info is not available. Please check your scm plugin.");
    private static LOAD_SCM_ERROR_KEY: string = "LOAD_SCM_ERROR";

    private appStatusStore: AppStatusStore;
    private sceneStore: SceneStore;

    constructor(appStatusStore: AppStatusStore, sceneStore: SceneStore, baseUrl?: string) {
        super(baseUrl);

        this.appStatusStore = appStatusStore;
        this.sceneStore = sceneStore;
    }

    public assertScmInfoAreLoaded(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (sceneStore.scmMetricLoaded) {
                resolve();
                return;
            }

            this.loadScmInfosIfAvailable().then(() => {
                this.sceneStore.scmMetricLoaded = true;
                resolve();
            });
        });
    }

    public loadScmInfosIfAvailable(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.checkScmInfosAvailable().then((isAvailable: boolean) => {
                if (isAvailable) {
                    this.loadScmInfos().then(() => resolve());
                } else {
                    resolve();
                }
            });
        });
    }

    public checkScmInfosAvailable(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.sceneStore.projectData !== null) {
                let allFiles: TreeElement[] = TreeService.getAllFiles(this.sceneStore.projectData);
                allFiles = allFiles.slice(0, 10);

                let requests: Array<Promise<void>> = [];
                for (let file of allFiles) {
                    requests.push(this.loadScmInfosFor(file));
                }

                Promise.all(requests).then(() => {
                    let isScmMetricAvailable = this.checkScmMetricAvailable(allFiles);
                    if (!isScmMetricAvailable) {
                        this.appStatusStore.status(SonarQubeScmService.STATUS_SCM_NOT_AVAILABLE);
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

    public loadScmInfos(): Promise<void> {
        this.appStatusStore.load(SonarQubeScmService.LOAD_SCM);

        return new Promise<void>((resolve, reject) => {
            if (this.sceneStore.projectData !== null) {
                let allFiles: TreeElement[] = TreeService.getAllFiles(this.sceneStore.projectData);

                this.loadScmInfosBatch(allFiles).then(() => {
                    this.appStatusStore.loadComplete(SonarQubeScmService.LOAD_SCM);
                    resolve();
                }).catch(() => {
                    reject();
                });
            } else {
                resolve();
            }
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

    private loadScmInfosBatch(allFiles: TreeElement[], page: number = 0): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let size: number = 75;
            let pageSize = Math.floor(allFiles.length / size);
            this.appStatusStore.loadStatusUpdate(SonarQubeScmService.LOAD_SCM.key, pageSize, page);

            let requests: Array<Promise<void>> = [];

            let start: number = page * size;
            let end: number = (page * size) + size;

            if (allFiles.length < end) {
                end = allFiles.length;
            }

            for (let i = start; i < end; i++) {
                requests.push(this.loadScmInfosFor(allFiles[i]));
            }

            Promise.all(requests).then(() => {
                let isNextBatchRequired: boolean = allFiles.length > (page * size) + size;
                if (isNextBatchRequired) {
                    this.loadScmInfosBatch(allFiles, page + 1).then(() => {
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

    private loadScmInfosFor(element: TreeElement): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const params = {key: element.key};
            this.callApi("/sources/scm", {params}).then((response) => {
                let metrics = (response.data.scm)
                    .map((c: any) => {
                            return ScmCalculator.createMetric(c);
                        }
                    );

                element.measures = Object.assign(element.measures, {
                    number_of_authors: ScmCalculator.calcNumberOfAuthors(metrics)
                });

                resolve();
            }).catch((error) => {
                this.appStatusStore.error(
                    new ErrorAction(SonarQubeScmService.LOAD_SCM_ERROR_KEY,
                        "SonarQube metric API is not available or responding: " + error.response.statusText,
                        "Try again", () => {
                            location.reload();
                        }));
                this.appStatusStore.loadComplete(SonarQubeScmService.LOAD_SCM);
                reject();
            });
        });
    }

}