import Metric from "./Metric";

export default class MetricSet {

    private metrics: Metric[];

    public constructor(metrics: Metric[]) {
        this.metrics = metrics;
    }

    public addMetrics(metrics: Metric[]): void {
        this.metrics = this.metrics.concat(metrics);
    }

    public getKeys(): string[] {
        return this.metrics.map((m) => (m.key));
    }

    public getSelectOptions(): SelectOptionValue[] {
        return this.metrics;
    }

}