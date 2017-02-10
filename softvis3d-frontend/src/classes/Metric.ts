export default class Metric implements SelectOptionValue {

    public id: string;
    public name: string;
    public type: MetricType;

    constructor(id: string, type: MetricType, name: string) {
        this.id = id;
        this.type = type;
        this.name = name;
    }

    public getId(): string {
        return this.id;
    }

    public getLabel(): string {
        return this.name;
    }

}
