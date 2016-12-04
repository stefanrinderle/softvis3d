const violationMetric: Metric = {
    key: "violations",
    type: "INT",
    name: "Issues"
};
const linesOfCodeMetric: Metric = {
    key: "ncloc",
    type: "INT",
    name: "Lines of Code"
};
const newIssuesMetric: Metric = {
    key: "new_violations",
    type: "INT",
    name: "New Issues"
};
const newLinesOfCodeMetric: Metric = {
    key: "new_lines_to_cover",
    type: "INT",
    name: "Lines to Cover on New Code"
};
const complexityMetric: Metric = {
    key: "complexity",
    type: "INT",
    name: "Complexity"
};

const demo: Profile = {
    id: "demo",
    name: "Default",
    metricHeight: linesOfCodeMetric,
    metricWidth: complexityMetric,
    metricColor: violationMetric,
    description: "Default risk analysis profile." +
    "Complexity as building footprint." +
    "lines of code as building height." +
    "Number of violations as building color."
};

const leakPeriod: Profile = {
    id: "leakPeriod",
    name: "Leak period",
    metricHeight: complexityMetric,
    metricWidth: newLinesOfCodeMetric,
    metricColor: newIssuesMetric,
    description: "Risk analysis for the leak period profile." +
    "Complexity as building footprint." +
    "New lines of code as building height." +
    "New violations as building color."
};

const custom: Profile = {
    id: "custom",
    name: "Customize",
    metricHeight: linesOfCodeMetric,
    metricWidth: complexityMetric,
    metricColor: violationMetric,
    description: "Choose wisely.",
    editable: true
};

export {
    demo,
    leakPeriod,
    custom
}
