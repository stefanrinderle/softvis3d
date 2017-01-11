import {linesOfCodeMetric, complexityMetric, newLinesOfCodeMetric, duplicatedLinesOfCodeMetric} from "./Metrics";
import LayoutProcessor from "../legacy/layoutProcessor";

const defaultProfile: Profile = {
    id: "default",
    name: "Default",
    metricWidth: complexityMetric,
    metricHeight: linesOfCodeMetric,
    scale: LayoutProcessor.SCALING_METHODS[0],
    description: "Default risk analysis profile. Complexity as building width and lines of code as building height " +
        "provide a very good overview of the structure. It should be easy to find hot spots of big classes with " +
        "a high complexity. The city / building metaphor works really good here and it should be easy know one's way " +
        "around."
};

const leakPeriod: Profile = {
    id: "leakPeriod",
    name: "Leak period",
    metricWidth: complexityMetric,
    metricHeight: newLinesOfCodeMetric,
    scale: LayoutProcessor.SCALING_METHODS[0],
    description: "Check the quality of new code in the current leak period. It should be easy to identify the " +
        "changing parts of the system and to identify the parts with the most risk. Take a closer look at the " +
        "conspicuously during the next release tests."
};

const duplicatedLinesOfCode: Profile = {
    id: "duplicatedLinesOfCode",
    name: "Duplicated lines",
    metricWidth: complexityMetric,
    metricHeight: duplicatedLinesOfCodeMetric,
    scale: LayoutProcessor.SCALING_METHODS[0],
    description: "Buildings only gain height if duplicated code is found within the class or file. Search for " +
        "host spots of high buildings. High and massive buildings could contain complex duplicated code which is " +
        "a high risk especially if a lot of changes take place."
};

const custom: Profile = {
    id: "custom",
    name: "Customize",
    metricWidth: complexityMetric,
    metricHeight: linesOfCodeMetric,
    scale: LayoutProcessor.SCALING_METHODS[0],
    description: "Select any metric using the 'Advanced options' at the bottom of this dialog.",
    editable: true
};

export {
    defaultProfile,
    leakPeriod,
    duplicatedLinesOfCode,
    custom
}
