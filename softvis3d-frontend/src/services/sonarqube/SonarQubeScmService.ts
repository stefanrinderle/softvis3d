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

import ErrorAction from "../../classes/status/ErrorAction";
import LoadAction from "../../classes/status/LoadAction";
import { TreeElement } from "../../classes/TreeElement";
import { lazyInject } from "../../inversify.config";
import AppStatusStore from "../../stores/AppStatusStore";
import SceneStore from "../../stores/SceneStore";
import TreeService from "../TreeService";
import { BackendService } from "./BackendService";
import ScmCalculatorService from "./ScmCalculatorService";

export default class SonarQubeScmService extends BackendService {
    public static readonly LOAD_SCM: LoadAction = new LoadAction(
        "SONAR_LOAD_SCM",
        "Request scm infos from SonarQube"
    );
    public static readonly STATUS_SCM_NOT_AVAILABLE: LoadAction = new LoadAction(
        "STATUS_SCM_NOT_AVAILABLE",
        "SCM blame info is not available. Please check your scm plugin."
    );
    private static readonly LOAD_SCM_ERROR_KEY = "LOAD_SCM_ERROR";

    @lazyInject("SceneStore")
    private readonly sceneStore!: SceneStore;
    @lazyInject("AppStatusStore")
    private readonly appStatusStore!: AppStatusStore;
    @lazyInject("TreeService")
    private readonly treeService!: TreeService;
    @lazyInject("ScmCalculatorService")
    private readonly scmCalculator!: ScmCalculatorService;

    constructor(baseUrl?: string) {
        super(baseUrl);
    }

    public assertScmInfoAreLoaded(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this.sceneStore.scmMetricLoaded) {
                resolve();
                return;
            }

            this.loadScmInfosIfAvailable().then(() => {
                this.sceneStore.scmMetricLoaded = true;
                resolve();
            });
        });
    }

    public checkScmInfosAvailable(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.sceneStore.projectData !== null) {
                let allFiles: TreeElement[] = this.treeService.getAllFiles(
                    this.sceneStore.projectData
                );
                allFiles = allFiles.slice(0, 10);

                const requests: Array<Promise<void>> = [];
                for (const file of allFiles) {
                    requests.push(this.loadScmInfosFor(file));
                }

                Promise.all(requests)
                    .then(() => {
                        const isScmMetricAvailable = this.checkScmMetricAvailable(allFiles);
                        if (!isScmMetricAvailable) {
                            this.appStatusStore.status(
                                SonarQubeScmService.STATUS_SCM_NOT_AVAILABLE
                            );
                        }
                        resolve(isScmMetricAvailable);
                    })
                    .catch(() => {
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
                const allFiles: TreeElement[] = this.treeService.getAllFiles(
                    this.sceneStore.projectData
                );

                this.loadScmInfosBatch(allFiles)
                    .then(() => {
                        this.appStatusStore.loadComplete(SonarQubeScmService.LOAD_SCM);
                        resolve();
                    })
                    .catch(() => {
                        reject();
                    });
            } else {
                resolve();
            }
        });
    }

    private loadScmInfosIfAvailable(): Promise<void> {
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

    private checkScmMetricAvailable(allFiles: TreeElement[]): boolean {
        for (const file of allFiles) {
            if (file.measures.number_of_authors > 0) {
                return true;
            }
        }
        return false;
    }

    private loadScmInfosBatch(allFiles: TreeElement[], page = 0): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const pageSize = 75;
            // example 146 / 75 = 1,94 => 1 => +1 => 2
            const pagesMax = Math.floor(allFiles.length / pageSize) + 1;
            this.appStatusStore.loadStatusUpdate(SonarQubeScmService.LOAD_SCM.key, pagesMax, page);

            const requests: Array<Promise<void>> = [];

            const start: number = page * pageSize;
            let end: number = page * pageSize + pageSize;

            if (allFiles.length < end) {
                end = allFiles.length;
            }

            for (let i = start; i < end; i++) {
                requests.push(this.loadScmInfosFor(allFiles[i]));
            }

            Promise.all(requests)
                .then(() => {
                    const isNextBatchRequired: boolean =
                        allFiles.length > page * pageSize + pageSize;
                    if (isNextBatchRequired) {
                        this.loadScmInfosBatch(allFiles, page + 1).then(() => {
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                })
                .catch(() => {
                    reject();
                });
        });
    }

    private loadScmInfosFor(element: TreeElement): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const params = { key: element.key };
            this.callApi("/sources/scm", { params })
                .then((response) => {
                    const metrics = response.data.scm.map((c: any) => {
                        return this.scmCalculator.createMetric(c);
                    });

                    element.measures = Object.assign(element.measures, {
                        number_of_authors: this.scmCalculator.calcNumberOfAuthors(metrics),
                    });

                    resolve();
                })
                .catch((error) => {
                    this.appStatusStore.error(
                        new ErrorAction(
                            SonarQubeScmService.LOAD_SCM_ERROR_KEY,
                            "SonarQube metric API is not available or responding: " +
                                error.response.statusText,
                            "Try again",
                            () => {
                                location.reload();
                            }
                        )
                    );
                    this.appStatusStore.loadComplete(SonarQubeScmService.LOAD_SCM);
                    reject();
                });
        });
    }
}
