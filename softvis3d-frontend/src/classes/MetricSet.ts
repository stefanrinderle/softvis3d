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

import {computed, isObservable, observable} from "mobx";
import Metric from "./Metric";

export default class MetricSet {
    @observable
    private metrics: Metric[];

    public constructor(metrics: Metric[]) {
        if (!isObservable(metrics)) {
            metrics = observable(metrics);
        }
        this.metrics = metrics;
    }

    public addMetric(metric: Metric): void {
        this.metrics.push(metric);
    }

    public addMetrics(metrics: Metric[]): void {
        this.metrics = this.metrics.concat(metrics);
    }

    @computed
    get length(): number {
        return this.metrics.length;
    }

    @computed
    get keys(): string[] {
        return this.metrics.map((m) => (m.id));
    }

    @computed
    get asSelectOptions(): SelectOptionValue[] {
        return this.metrics;
    }

    public getMetricByKey(sourceId: string): Metric | undefined {
        if (!sourceId) {
            return;
        }

        for (const metric of this.metrics) {
            if (metric.id === sourceId) {
                return metric;
            }
        }
    }
}
