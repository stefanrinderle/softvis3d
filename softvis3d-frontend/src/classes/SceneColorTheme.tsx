export class SceneColorTheme implements SelectOptionValue {

    public readonly id: string;
    public readonly label: string;
    public readonly backgroundColor: number;

    constructor(id: string, label: string, backgroundColor: number) {
        this.id = id;
        this.label = label;
        this.backgroundColor = backgroundColor;
    }

}