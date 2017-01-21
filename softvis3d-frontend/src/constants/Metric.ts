export default class Metric implements SelectOptionValue {

    public key: string;
    public name: string;
    public type: MetricType;

    constructor(key: string, type: MetricType, name: string) {
        this.key = key;
        this.type = type;
        this.name = name;
    }

    public getLabel(): string {
        return this.name;
    }

}
