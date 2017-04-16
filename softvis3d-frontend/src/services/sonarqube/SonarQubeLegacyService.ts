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
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import {AppStatusStore} from "../../stores/AppStatusStore";
import {SceneStore} from "../../stores/SceneStore";
import LoadAction from "../../classes/status/LoadAction";
import ErrorAction from "../../classes/status/ErrorAction";
import {noColorMetric, numberOfAuthorsBlameColorMetric, packageNameColorMetric} from "../../constants/Metrics";

export default class SonarQubeLegacyService extends BackendService {
    public static LOAD_LEGACY: LoadAction = new LoadAction("SONAR_LOAD_LEGACY_BACKEND", "Request measures from SonarQube");
    public static LOAD_MEASURES_ERROR_KEY: string = "LOAD_MEASURES_ERROR";

    private projectKey: string;
    private appStatusStore: AppStatusStore;
    private cityBuilderStore: CityBuilderStore;
    private sceneStore: SceneStore;

    private currentParams: SonarVisualizationRequestParams;

    constructor(
        apiUrl: string,
        projectKey: string,
        appStatusStore: AppStatusStore,
        cityBuilderStore: CityBuilderStore,
        sceneStore: SceneStore
    ) {
        super(apiUrl);

        this.projectKey = projectKey;
        this.appStatusStore = appStatusStore;
        this.cityBuilderStore = cityBuilderStore;
        this.sceneStore = sceneStore;
    }

    public loadLegacyBackend() {
        this.appStatusStore.load(SonarQubeLegacyService.LOAD_LEGACY);

        const params = new SonarVisualizationRequestParams(this.projectKey, this.getMetricRequestValues());

        if (this.currentParams && this.currentParams.equals(params)) {
            this.appStatusStore.loadComplete(SonarQubeLegacyService.LOAD_LEGACY);
            this.sceneStore.legacyData = Object.assign({}, this.sceneStore.legacyData);
        } else {
            this.callApi("/softVis3D/getVisualization", { params }).then((response) => {
                this.appStatusStore.loadComplete(SonarQubeLegacyService.LOAD_LEGACY);
                this.currentParams = params;
                this.sceneStore.scmMetricLoaded = false;
                this.sceneStore.legacyData = response.data;
            }).catch((error) => {
                let message;

                if ("response" in error) {
                    message = "SonarQube measure API is not available or responding: " + error.response.statusText;
                } else {
                    console.error(error);
                    message = "Internal Error: Could not load data.";
                }

                this.appStatusStore.loadComplete(SonarQubeLegacyService.LOAD_LEGACY);
                this.appStatusStore.error(
                    new ErrorAction(SonarQubeLegacyService.LOAD_MEASURES_ERROR_KEY,
                        message,
                        "Try again", () => {
                            this.loadLegacyBackend();
                        })
                );
            });
        }
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

class SonarVisualizationRequestParams {

    public readonly projectKey: string;
    public readonly metrics: string;

    constructor(projectKey: string, metrics: string) {
        this.projectKey = projectKey;
        this.metrics = metrics;
    }

    public equals(candidate: SonarVisualizationRequestParams): boolean {
        if (candidate) {
            return this.projectKey === candidate.projectKey && this.metrics === candidate.metrics;
        } else {
            return false;
        }
    }

}