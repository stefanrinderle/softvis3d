export default class Layout implements SelectOptionValue {
    public readonly id: string;
    public readonly label: string;
    public readonly description: string;

    constructor(id: string, label: string, description: string) {
        this.id = id;
        this.label = label;
        this.description = description;
    }
}
