/* #################################### *
 * ##         Custom Metrics         ## *
 * #################################### */

import Metric from "../classes/Metric";

export const complexityMetricId = "complexity";
export const linesOfCodeMetricId = "ncloc";
export const newLinesOfCodeMetricId = "new_lines";
export const duplicatedLinesOfCodeMetricId = "duplicated_lines";
export const noMetricId = "none";

export const coverageMetricId = "coverage";
export const newLinesToCoverMetricId = "new_lines_to_cover";

export const noMetric: Metric = new Metric(noMetricId, "NONE", " -- None -- ",
    "The building color can be changed dynamically in the view using the combo box in the bottom bar.");

export const packageNameMetric: Metric = new Metric("package", "NONE", "Package Name",
    "Every house is assigned a color, depending on it's containing package or namespace.");

/* #################################### *
 * ## Metrics available in SonarQube ## *
 * #################################### */

export const violationMetric: Metric = new Metric("violations", "INT", "Issues",
    "Scale from green (no open violations) to red (highest number of violations).");

export const linesOfCodeMetric: Metric = new Metric(linesOfCodeMetricId, "INT", "Lines of Code",
    "Scale from green (few lines of code) to red (a lot of lines of code).");

export const newIssuesMetric: Metric = new Metric("new_violations", "INT", "New Issues",
    "Scale from green (no new issues) to red (highest number of new issues).");

export const complexityMetric: Metric = new Metric(complexityMetricId, "INT", "Complexity",
    "Scale from green (low complexity) to red (high complexity).");

export const coverageMetric: Metric = new Metric(coverageMetricId, "PERCENT", "Coverage",
    "Scale from green (high coverage) to red (low or no coverage).");

export const openIssuesMetric: Metric = new Metric("open_issues", "INT", "Open Issues",
    "Scale from green (no open issues) to red (a lot of issues).");

export class ColorMetrics {

    public static availableColorMetrics: Metric[] = [
        noMetric,
        complexityMetric,
        coverageMetric,
        violationMetric,
        newIssuesMetric,
        linesOfCodeMetric,
        openIssuesMetric,
        packageNameMetric
    ];

    public static getColorMetricById(id: string): Metric | undefined {
        for (let availableColorMetric of ColorMetrics.availableColorMetrics) {
            if (availableColorMetric.id === id) {
                return availableColorMetric;
            }
        }
    }

}