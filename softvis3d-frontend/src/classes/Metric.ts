export default class Metric implements SelectOptionValue {

    public description: string;

    private id: string;
    private name: string;

    constructor(id: string, name: string, description: string) {
        this.id = id;
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
