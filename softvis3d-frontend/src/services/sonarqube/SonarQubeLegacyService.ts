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
/* tslint:disable */
import {BackendService} from "./BackendService";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import {AppStatusStore} from "../../stores/AppStatusStore";
import {SceneStore} from "../../stores/SceneStore";

export default class SonarQubeLegacyService extends BackendService {
    public static LOAD_LEGACY = 'SONAR_LOAD_LEGACY_BACKEND';

    private projectKey: string;
    private appStatusStore: AppStatusStore;
    private cityBuilderStore: CityBuilderStore;
    private sceneStore: SceneStore;

    constructor(apiUrl: string, projectKey: string,
                appStatusStore: AppStatusStore, cityBuilderStore: CityBuilderStore, sceneStore: SceneStore) {
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

        return this.callApi("/softVis3D/getVisualization", { params }).then(response => {
            this.appStatusStore.loadComplete(SonarQubeLegacyService.LOAD_LEGACY);
            this.sceneStore.legacyData = response.data;
        }).catch(console.log);
    }

    public getMetricRequestValues(): string {
        let result: Set<string> = new Set;

        result.add(this.cityBuilderStore.profile.metricWidth.key);
        result.add(this.cityBuilderStore.profile.metricHeight.key);

        const colorMetrics: string[] = this.cityBuilderStore.colorMetrics.keys;

        for (let i = 0; i < colorMetrics.length; i++) {
            if (colorMetrics[i] !== 'none' && colorMetrics[i] !== 'package') {
                result.add(colorMetrics[i]);
            }
        }

        return this.getColorMetricsString(result);
    }

    public getColorMetricsString(colorMetrics: Set<string>): string {
        return Array.from(colorMetrics).join(",");
    }
}