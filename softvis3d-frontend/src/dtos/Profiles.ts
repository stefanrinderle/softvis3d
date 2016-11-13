const demo: Profile = {
    id: "demo",
    name: "Default",
    metricColor: "none",
    metricHeight: "ncloc",
    metricWidth: "complexity",
    description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod " +
        "tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. " +
        "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, " +
        "no sea takimata sanctus est Lorem ipsum dolor sit amet. "
};

const custom: Profile = {
    id: "custom",
    name: "Customize",
    metricColor: "",
    metricHeight: "",
    metricWidth: "",
    description: "Choose wisely.",
    editable: true
};

export {
    demo,
    custom
}