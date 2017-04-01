export default class Scale implements SelectOptionValue {

    public description: string;

    private id: string;
    private label: string;

    constructor(id: string, label: string, description: string) {
        this.id = id;
        this.label = label;
        this.description = description;
    }

    public getId(): string {
        return this.id;
    }

    public getLabel(): string {
        return this.label;
    }

}
