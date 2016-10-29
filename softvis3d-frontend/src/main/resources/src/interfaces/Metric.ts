type MetricType = "INT" | "FLOAT" | "PERCENT" | "BOOL";

export interface Metric {
    id: string | number;
    key: string;
    type: MetricType;
    name: string;
}