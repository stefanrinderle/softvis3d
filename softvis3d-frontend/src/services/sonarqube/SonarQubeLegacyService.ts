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

export default class SonarQubeLegacyService extends BackendService {
    public static LOAD_LEGACY: LoadAction = new LoadAction("SONAR_LOAD_LEGACY_BACKEND", "Request measures from SonarQube");
    public static LOAD_MEASURES_ERROR_KEY: string = "LOAD_MEASURES_ERROR";

    private projectKey: string;
    private appStatusStore: AppStatusStore;
    private cityBuilderStore: CityBuilderStore;
    private sceneStore: SceneStore;

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

        const params = {
            projectKey: this.projectKey,
            metrics: this.getMetricRequestValues()
        };

        this.callApi("/softVis3D/getVisualization", { params }).then((response) => {
            this.appStatusStore.loadComplete(SonarQubeLegacyService.LOAD_LEGACY);
            this.sceneStore.legacyData = response.data;
        }).catch((error) => {
            this.appStatusStore.loadComplete(SonarQubeLegacyService.LOAD_LEGACY);
            this.appStatusStore.error(
                new ErrorAction(SonarQubeLegacyService.LOAD_MEASURES_ERROR_KEY,
                    "SonarQube measure API is not available or responding: " + error.response.statusText,
                    "Try again", () => {
                        this.loadLegacyBackend();
                    })
            );
        });
    }

    private getMetricRequestValues(): string {
        let result: Set<string> = new Set();
        result.add(this.cityBuilderStore.profile.footprint.id);
        result.add(this.cityBuilderStore.profile.height.id);

        for (const colorMetric of this.cityBuilderStore.colorMetrics.keys) {
            if (colorMetric !== "none" && colorMetric !== "package") {
                result.add(colorMetric);
            }
        }

        return Array.from(result).join(",");
    }
}