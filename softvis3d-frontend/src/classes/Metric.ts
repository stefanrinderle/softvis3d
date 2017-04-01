export default class Metric implements SelectOptionValue {

    public id: string;
    public name: string;
    public type: MetricType;
    public description: string;

    constructor(id: string, type: MetricType, name: string, description: string) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.description = description;
    }

    public getId(): string {
        return this.id;
    }

    public getLabel(): string {
        return this.name;
    }

}
