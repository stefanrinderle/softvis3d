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
import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import {reaction} from "mobx";
import cityBuilderStore from "./stores/CityBuilderStore";
import appStatusStore from "./stores/AppStatusStore";
import sceneStore from "./stores/SceneStore";

interface SonarQubeMetric extends Metric {
    id: number;
}

export default class SonarQubeCommunicator {
    public static LOAD_METRICS = 'SONAR_LOAD_METRICS';
    public static LOAD_LEGACY = 'SONAR_LOAD_LEGACY_BACKEND';
    private projectKey: string;
    private baseUrl: string;

    constructor(apiUrl: string, projectKey: string) {
        this.baseUrl = apiUrl;
        this.projectKey = projectKey;
    }

    public init() {
        this.loadAvailableMetrics();

        reaction(
            "Load backend legacy data when the scene should be rendered",
            () => cityBuilderStore.renderButtonClicked,
            () => { this.loadLegacyBackend().then(() => { cityBuilderStore.renderButtonClicked = false; }) }
        );
    }

    private callApi(route: string, options: AxiosRequestConfig = {}): AxiosPromise {
        return axios.get(this.baseUrl + route, options);
    }

    private loadAvailableMetrics(page = 1) {
        if (page === 1) {
            appStatusStore.load(SonarQubeCommunicator.LOAD_METRICS);
        }

        const params = {f: 'name', p: page};

        this.callApi("/metrics/search", { params }).then(response => {
            const metrics = (response.data.metrics as Array<SonarQubeMetric>)
                .filter((c) => c.type === "INT")
                .map((c) => { delete c.id; return c; });
            cityBuilderStore.addAvailableMetrics(metrics);

            const metricsCount = response.data.p * response.data.ps;
            if (metricsCount < response.data.total) {
                this.loadAvailableMetrics(page + 1);
            } else {
                appStatusStore.loadComplete(SonarQubeCommunicator.LOAD_METRICS);
            }
        }).catch(console.log);
    }

    private loadLegacyBackend() {
        appStatusStore.load(SonarQubeCommunicator.LOAD_LEGACY);

        const params = {
            projectKey: this.projectKey,
            footprintMetricKey: cityBuilderStore.metricWidth.key,
            heightMetricKey: cityBuilderStore.metricHeight.key,
            colorMetricKey: cityBuilderStore.metricColor.key
        };

        return this.callApi("/softVis3D/getVisualization", { params }).then(response => {
            appStatusStore.loadComplete(SonarQubeCommunicator.LOAD_LEGACY);
            sceneStore.legacyData = response.data.resultObject[0].treeResult;
        }).catch(console.log);
    }
}