export default class BuildingColorTheme implements SelectOptionValue {
    public readonly id: string;
    public readonly label: string;
    public readonly description: string;
    public readonly goodColor: number;
    public readonly badColor: number;

    constructor(id: string, label: string, description: string, goodColor: number, badColor: number) {
        this.id = id;
        this.label = label;
        this.description = description;
        this.goodColor = goodColor;
        this.badColor = badColor;
    }
}
