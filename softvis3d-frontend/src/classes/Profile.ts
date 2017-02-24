import Metric from "./Metric";
import Scale from "./Scale";
import {observable} from "mobx";

export default class Profile implements SelectOptionValue {

    public id: string;
    public description: string;
    @observable
    public height: Metric;
    @observable
    public footprint: Metric;
    @observable
    public scale: Scale;
    private name: string;

    constructor(builder: ProfileBuilder) {
        this.id = builder.id;
        this.name = builder.name;
        this.height = builder.height;
        this.footprint = builder.footprint;
        this.scale = builder.scale;
        this.description = builder.description;
    }

    public getId(): string {
        return this.id;
    }

    public getLabel(): string {
        return this.name;
    }

    public updateConfiguration(footprint: Metric, height: Metric, scale: Scale): void {
        this.height = height;
        this.footprint = footprint;
        this.scale = scale;
    }

    public clone(): Profile {
        return new ProfileBuilder(this.id, this.name)
            .withConfiguration(this.footprint, this.height, this.scale)
            .withDescription(this.description)
            .build();
    }
}

export class ProfileBuilder {

    public id: string;
    public name: string;
    public height: Metric;
    public footprint: Metric;
    public scale: Scale;
    public description: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public withConfiguration(footprint: Metric, height: Metric, scale: Scale): ProfileBuilder {
        this.height = height;
        this.footprint = footprint;
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