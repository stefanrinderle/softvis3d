
import {linesOfCodeMetric, complexityMetric, newLinesOfCodeMetric} from "./Metrics";
const demo: Profile = {
    id: "demo",
    name: "Default",
    metricHeight: linesOfCodeMetric,
    metricWidth: complexityMetric,
    description: "Default risk analysis profile." +
    "Complexity as building footprint." +
    "lines of code as building height."
};

const leakPeriod: Profile = {
    id: "leakPeriod",
    name: "Leak period",
    metricHeight: complexityMetric,
    metricWidth: newLinesOfCodeMetric,
    description: "Risk analysis for the leak period profile." +
    "Complexity as building footprint." +
    "New lines of code as building height."
};

const custom: Profile = {
    id: "custom",
    name: "Customize",
    metricHeight: null,
    metricWidth: null,
    description: "Choose wisely.",
    editable: true
};

export {
    demo,
    leakPeriod,
    custom
}
