/* #################################### *
 * ##         Custom Metrics         ## *
 * #################################### */

import {
    noMetric, complexityMetric, coverageMetric, violationMetric, newIssuesMetric,
    linesOfCodeMetric, openIssuesMetric, packageNameMetric
} from "./Metrics";
import Metric from "../classes/Metric";

interface ColorMetricDescription {
    metric: Metric;
    text: string;
}

const noMetricDescription: ColorMetricDescription = {
    metric: noMetric,
    text: "The building color can be changed dynamically in the view using the combo box in the bottom bar."
};

const complexityMetricDescription: ColorMetricDescription = {
    metric: complexityMetric,
    text: "Scale from green, low complexity, to red, high complexity."
};
const coverageMetricDescription: ColorMetricDescription = {
    metric: coverageMetric,
    text: "Scale from green, high coverage, to red, no or low coverage."
};
const violationMetricDescription: ColorMetricDescription = {
    metric: violationMetric,
    text: "Scale from green, no open violations, to red, highest number of " +
        "violations."
};
const newIssuesMetricDescription: ColorMetricDescription = {
    metric: newIssuesMetric,
    text: "Scale from green, no new issues, to red, highest number of new " +
        "issues."
};
const linesOfCodeMetricDescription: ColorMetricDescription = {
    metric: linesOfCodeMetric,
    text: "Scale from green to red with the number of lines."
};
const openIssuesMetricDescription: ColorMetricDescription = {
    metric: openIssuesMetric,
    text: "Scale from green, no open issues, to red, highest number of " +
        "issues."
};
const packageNameMetricDescription: ColorMetricDescription = {
    metric: packageNameMetric,
    text: "Every package gets a random color."
};

const availableColorMetricDescriptions: ColorMetricDescription[] = [
    noMetricDescription,
    complexityMetricDescription,
    coverageMetricDescription,
    violationMetricDescription,
    newIssuesMetricDescription,
    linesOfCodeMetricDescription,
    openIssuesMetricDescription,
    packageNameMetricDescription
];

export function GET_COLOR_METRIC_DESCRIPTION(metric: Metric): string {
    for (let description of availableColorMetricDescriptions) {
        if (description.metric === metric) {
            return description.text;
        }
    }

    return noMetricDescription.text;
}