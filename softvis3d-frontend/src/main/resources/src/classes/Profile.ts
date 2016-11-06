export default class Profile {
    public readonly id: string;
    public readonly name: string;
    public readonly metricColor: string;
    public readonly metricHeight: string;
    public readonly metricWidth: string;
    public readonly description: string;
    public readonly editable: boolean;

    public constructor(
        id: string,
        name: string,
        metricColor: string,
        metricHeight: string,
        metricWidth: string,
        description: string,
        editable: boolean = false
    ) {
        this.id = id;
        this.name = name;
        this.metricColor = metricColor;
        this.metricHeight = metricHeight;
        this.metricWidth = metricWidth;
        this.description = description;
        this.editable = editable;
    }
}

const demo = new Profile(
    "demo",
    "Default",
    "",
    "ncloc",
    "complexity",
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod " +
    "tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. " +
    "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, " +
    "no sea takimata sanctus est Lorem ipsum dolor sit amet. "
);

const custom = new Profile(
    "custom",
    "Custom Metrics",
    "",
    "",
    "",
    "Choose wisely.",
    true
);

export {
    demo,
    custom
}