import {observable} from "mobx";
import {noMetric} from "../constants/Metrics";
import Metric from "./Metric";
import Scale from "./Scale";

export default class Profile implements SelectOptionValue {
    public readonly id: string;
    public readonly label: string;
    public readonly description: string;
    @observable
    public heightMetric: Metric;
    @observable
    public footprintMetric: Metric;
    @observable
    public scale: Scale;

    constructor(id: string, label: string, description: string, heightMetric: Metric, footprintMetric: Metric, scale: Scale) {
        this.id = id;
        this.label = label;
        this.description = description;
        this.heightMetric = heightMetric;
        this.footprintMetric = footprintMetric;
        this.scale = scale;
    }

    public updateConfiguration(footprintMetric: Metric, heightMetric: Metric, scale: Scale): void {
        this.heightMetric = heightMetric;
        this.footprintMetric = footprintMetric;
        this.scale = scale;
    }

    public clone(): Profile {
        return new ProfileBuilder(this.id, this.label)
            .withConfiguration(this.footprintMetric, this.heightMetric, this.scale)
            .withDescription(this.description)
            .build();
    }
}

export class ProfileBuilder {

    public id: string;
    public name: string;
    public heightMetric: Metric;
    public footprintMetric: Metric;
    public scale: Scale;
    public description: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;

        this.heightMetric = noMetric;
        this.footprintMetric = noMetric;
        this.scale = new Scale("none", "None", "");
        this.description = "";
    }

    public withConfiguration(footprintMetric: Metric, heightMetric: Metric, scale: Scale): ProfileBuilder {
        this.heightMetric = heightMetric;
        this.footprintMetric = footprintMetric;
        this.scale = scale;
        return this;
    }

    public withDescription(description: string): ProfileBuilder {
        this.description = description;
        return this;
    }

    public build(): Profile {
        return new Profile(this.id, this.name, this.description, this.heightMetric, this.footprintMetric, this.scale);
    }

}