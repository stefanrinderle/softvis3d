import Metric from "./Metric";

export default class ColorMetric extends Metric {

    public description: string;

    constructor(id: string, type: MetricType, name: string, description: string) {
        super(id, type, name);
        this.description = description;
    }

}
