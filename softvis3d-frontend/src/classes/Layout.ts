export default class Layout implements SelectOptionValue {

    public id: string;
    public name: string;
    public description: string;

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public getValue(): string {
        return this.id;
    }

    public getLabel(): string {
        return this.name;
    }
}
