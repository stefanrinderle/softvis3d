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
import {SceneStore} from "../../stores/SceneStore";
import {TreeService} from "../TreeService";

export interface SonarQubeApiScm {
    lineNumber: number;
    author_name: string;
    lastCommit: string;
    lastCommitRevision: string;
}

export default class SonarQubeScmService extends BackendService {
    public static LOAD_SCM: LoadAction = new LoadAction("SONAR_LOAD_SCM", "Request scm infos from SonarQube");
    private static LOAD_SCM_ERROR_KEY: string = "LOAD_SCM_ERROR";

    private appStatusStore: AppStatusStore;
    private sceneStore: SceneStore;

    constructor(apiUrl: string, appStatusStore: AppStatusStore, sceneStore: SceneStore) {
        super(apiUrl);

        this.appStatusStore = appStatusStore;
        this.sceneStore = sceneStore;
    }

    public loadScmInfos(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this.sceneStore.legacyData !== null) {
                let allFiles: TreeElement[] = TreeService.getAllFiles(this.sceneStore.legacyData);

                let requests: Array<Promise<void>> = [];
                for (let file of allFiles) {
                    requests.push(this.loadScmInfosFor(file));
                }

                Promise.all(requests).then(() => {
                    resolve();
                });
            }
        });
    }

    private loadScmInfosFor(element: TreeElement): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.appStatusStore.load(SonarQubeScmService.LOAD_SCM);

            const params = {key: element.key};
            this.callApi("/sources/scm", {params}).then((response) => {
                let metrics = (response.data.scm)
                    .map((c: any) => {
                            return this.createMetric(c);
                        }
                    );

                element.measures = Object.assign(element.measures, {
                    scmNumberOfAuthorsColorMetric: this.calcNumberOfAuthors(metrics)
                });

                this.appStatusStore.loadComplete(SonarQubeScmService.LOAD_SCM);
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

    private calcNumberOfAuthors(measures: [SonarQubeApiScm]): number {
        let groupByAuthorName = this.groupByAuthorName(measures);
        return groupByAuthorName.size;
    }

    private groupByAuthorName(measures: [SonarQubeApiScm]) {
        const map = new Map();
        measures.forEach((item) => {
            const key = item.author_name;
            if (!map.has(key)) {
                map.set(key, [item]);
            } else {
                map.get(key).push(item);
            }
        });
        return map;
    }

    private createMetric(measure: [string]): SonarQubeApiScm {
        return {
            lineNumber: +measure[0],
            author_name: measure[1],
            lastCommit: measure[2],
            lastCommitRevision: measure[3]
        };
    }

}