export default class Scale implements SelectOptionValue {

    private id: string;
    private label: string;

    constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }

    public getId(): string {
        return this.id;
    }

    public getLabel(): string {
        return this.label;
    }

}
