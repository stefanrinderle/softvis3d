import Metric from "./Metric";
import Scale from "./Scale";

export default class Profile implements SelectOptionValue {

    public id: string;
    public description: string;
    public metricHeight: Metric;
    public metricWidth: Metric;
    public scale: Scale;
    private name: string;

    constructor(builder: ProfileBuilder) {
        this.id = builder.id;
        this.name = builder.name;
        this.metricHeight = builder.metricHeight;
        this.metricWidth = builder.metricWidth;
        this.scale = builder.scale;
        this.description = builder.description;
    }

    public getLabel(): string {
        return this.name;
    }

}

export class ProfileBuilder {

    public id: string;
    public name: string;
    public metricHeight: Metric;
    public metricWidth: Metric;
    public scale: Scale;
    public description: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public withConfiguration(metricWidth: Metric, metricHeight: Metric, scale: Scale): ProfileBuilder {
        this.metricHeight = metricHeight;
        this.metricWidth = metricWidth;
        this.scale = scale;
        return this;
    }

    public withDescription(description: string): ProfileBuilder {
        this.description = description;
        return this;
    }

    public build(): Profile {
        return new Profile(this);
    }

}