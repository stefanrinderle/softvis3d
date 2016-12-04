
import {linesOfCodeMetric, complexityMetric, violationMetric, newLinesOfCodeMetric, newIssuesMetric} from "./Metrics";
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
    metricHeight: null,
    metricWidth: null,
    metricColor: null,
    description: "Choose wisely.",
    editable: true
};

export {
    demo,
    leakPeriod,
    custom
}
