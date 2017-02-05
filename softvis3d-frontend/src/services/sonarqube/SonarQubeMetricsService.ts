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
import { BackendService } from "./BackendService";
import { AppStatusStore } from "../../stores/AppStatusStore";
import { CityBuilderStore } from "../../stores/CityBuilderStore";
import Metric from "../../classes/Metric";
import { leakPeriod } from "../../constants/Profiles";
import { newLinesToCoverMetric } from "../../constants/Metrics";
import LoadAction from "../../classes/status/LoadAction";
import ErrorAction from "../../classes/status/ErrorAction";

export interface SonarQubeApiMetric {
    id: number;
    key: string;
    type: MetricType;
    name: string;
    hidden?: boolean;
}

export default class SonarQubeMetricsService extends BackendService {
    public static LOAD_METRICS: LoadAction = new LoadAction("SONAR_LOAD_METRICS", "Request metric definitions from SonarQube");
    private static LOAD_METRICS_ERROR_KEY: string = "LOAD_METRICS_ERROR";

    private appStatusStore: AppStatusStore;
    private cityBuilderStore: CityBuilderStore;

    constructor(apiUrl: string, appStatusStore: AppStatusStore, cityBuilderStore: CityBuilderStore) {
        super(apiUrl);

        this.appStatusStore = appStatusStore;
        this.cityBuilderStore = cityBuilderStore;
    }

    public loadAvailableMetrics(page = 1) {
        if (page === 1) {
            this.appStatusStore.load(SonarQubeMetricsService.LOAD_METRICS);
        }

        const params = {f: "name", p: page};
        this.callApi("/metrics/search", { params }).then((response) => {
            const metrics: Metric[] = (response.data.metrics as SonarQubeApiMetric[])
                .filter((c) => this.shouldMetricBeFiltered(c.type))
                .filter((c) => c.hidden === true || c.hidden === undefined || c.hidden === null)
                .map((c) => { return this.createMetric(c); });

            this.cityBuilderStore.genericMetrics.addMetrics(metrics);

            const metricsPosition = response.data.p * response.data.ps;
            if (metricsPosition < response.data.total) {
                this.loadAvailableMetrics(page + 1);
            } else {
                this.checkNewLinesOfCodeMetric();

                this.appStatusStore.loadComplete(SonarQubeMetricsService.LOAD_METRICS);
            }

        }).catch((error) => {
            this.appStatusStore.error(
                new ErrorAction(SonarQubeMetricsService.LOAD_METRICS_ERROR_KEY,
                    "SonarQube metric API is not available or responding: " + error.response.statusText));
            this.appStatusStore.loadComplete(SonarQubeMetricsService.LOAD_METRICS);
        });
    }

    private createMetric(sonarQubeMetric: SonarQubeApiMetric): Metric {
        return new Metric(sonarQubeMetric.key, sonarQubeMetric.type, sonarQubeMetric.name);
    }

    private shouldMetricBeFiltered(type: string): boolean {
        return type === "INT" || type === "FLOAT" || type === "PERCENT"
            || type === "MILLISEC" || type === "RATING" || type === "WORK_DUR";
    }

    private checkNewLinesOfCodeMetric() {
        if (!this.cityBuilderStore.genericMetrics.hasNewLinesOfCodeMetric) {
            leakPeriod.metricHeight = newLinesToCoverMetric;
        }
    }

}