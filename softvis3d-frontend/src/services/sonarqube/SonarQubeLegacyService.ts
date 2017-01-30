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

export default class SonarQubeLegacyService extends BackendService {
    public static LOAD_LEGACY = "SONAR_LOAD_LEGACY_BACKEND";

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

        return this.callApi("/softVis3D/getVisualization", { params }).then((response) => {
            this.appStatusStore.loadComplete(SonarQubeLegacyService.LOAD_LEGACY);
            this.sceneStore.legacyData = response.data;
        }).catch(console.log);
    }

    private getMetricRequestValues(): string {
        let result: string[] = this.cityBuilderStore.colorMetrics.keys.filter((c) => c !== "none" && c !== "package");
        result.push(this.cityBuilderStore.profile.metricWidth.key, this.cityBuilderStore.profile.metricHeight.key);

        // Make Unique, then join
        return result.filter((v, i, s) => s.indexOf(v) === i).join(",");
    }
}