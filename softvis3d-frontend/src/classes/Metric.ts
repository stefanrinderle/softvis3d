import {MetricType} from "./MetricType";

export default class Metric implements SelectOptionValue {
    public readonly id: string;
    public readonly label: string;
    public readonly description: string;
    public readonly type: MetricType;

    constructor(id: string, label: string, description: string, type: MetricType = MetricType.UNKNOWN) {
        this.id = id;
        this.label = label;
        this.description = description;
        this.type = type;
    }
}
