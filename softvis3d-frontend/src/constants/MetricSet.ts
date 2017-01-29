import Metric from "./Metric";
import { computed, observable, isObservable } from "mobx";
import { newLinesOfCodeMetric } from "./Metrics";

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
        return this.metrics.map((m) => (m.key));
    }

    @computed
    get asSelectOptions(): SelectOptionValue[] {
        return this.metrics;
    }

    @computed
    get hasNewLinesOfCodeMetric(): boolean {
        let result: boolean = false;

        for (let metric of this.metrics) {
            if (metric.key === newLinesOfCodeMetric.key) {
                return true;
            }
        }

        return result;
    }
}
