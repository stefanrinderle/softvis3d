export default class Layout {
    public readonly id: string;
    public readonly name: string;
    public readonly preview: string;

    public constructor(id: string, name: string, preview: string = "") {
        this.id = id;
        this.name = name;
        this.preview = preview;
    }
}

const district = new Layout("district", "District", "static/resources/preview-district.png");
const evostreet = new Layout("evostreet", "Evostreet", "static/resources/preview-evostreet.png");

export {
    district,
    evostreet
};
