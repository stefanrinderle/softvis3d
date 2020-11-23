/* #################################### *
 * ##         Custom Metrics         ## *
 * #################################### */

import Metric from "../classes/Metric";
import {MetricType} from "../classes/MetricType";

export const complexityMetric = new Metric("complexity", "Cyclomatic Complexity", "Cyclomatic complexity", MetricType.INT);
export const linesOfCodeMetric = new Metric("ncloc", "Lines of Code", "Non commenting lines of code", MetricType.INT);
export const newLinesOfCodeMetric = new Metric("new_lines", "New Lines", "New Lines", MetricType.INT);
export const duplicatedLinesOfCodeMetric = new Metric("duplicated_lines", "Duplicated Lines", "Duplicated Lines", MetricType.INT);
export const noMetric = new Metric("none", "-- None --", "", MetricType.UNKNOWN);

export const coverageMetricId = "coverage";

/* ############################################################# *
 * ## Color metric definitions with color descriptions        ## *
 * ## should only used for color metric settings and options. ## *
 * ############################################################# */

export const noColorMetric: Metric = new Metric(noMetric.id, noMetric.label,
    "All buildings will have the same color.");

export const packageNameColorMetric: Metric = new Metric("package", "Package Name",
    "Every building is assigned a color, depending on it's containing package or namespace.");

export const violationsColorMetric: Metric = new Metric("violations", "Issues",
    "Scale from green (no open violations) to red (highest number of violations).");

export const linesOfCodeColorMetric: Metric = new Metric(linesOfCodeMetric.id, "Lines of Code",
    "Scale from green (few lines of code) to red (a lot of lines of code).");

export const newIssuesColorMetric: Metric = new Metric("new_violations", "New Issues",
    "Scale from green (no new issues) to red (highest number of new issues).");

export const complexityColorMetric: Metric = new Metric(complexityMetric.id, "Complexity",
    "Scale from green (low complexity) to red (high complexity).");

export const coverageColorMetric: Metric = new Metric(coverageMetricId, "Coverage",
    "Scale from green (high coverage) to red (low or no coverage).");

export const openIssuesColorMetric: Metric = new Metric("open_issues", "Open Issues",
    "Scale from green (no open issues) to red (a lot of issues).");

export const numberOfAuthorsBlameColorMetric: Metric = new Metric("number_of_authors",
    "Number of authors", "Number of authors based on the SCM blame info. See help page for details.");

export class ColorMetrics {

    public static availableColorMetrics: Metric[] = [
        noColorMetric,
        complexityColorMetric,
        coverageColorMetric,
        numberOfAuthorsBlameColorMetric,
        violationsColorMetric,
        newIssuesColorMetric,
        linesOfCodeColorMetric,
        openIssuesColorMetric,
        packageNameColorMetric
    ];

    public static getColorMetricById(id: string): Metric | undefined {
        for (let availableColorMetric of ColorMetrics.availableColorMetrics) {
            if (availableColorMetric.id === id) {
                return availableColorMetric;
            }
        }
    }

}