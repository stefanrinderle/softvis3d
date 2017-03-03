/* #################################### *
 * ##         Custom Metrics         ## *
 * #################################### */

import Metric from "../classes/Metric";
import ColorMetric from "../classes/ColorMetric";

export const noMetric: ColorMetric = new ColorMetric("none", "NONE", " -- None -- ",
    "The building color can be changed dynamically in the view using the combo box in the bottom bar.");

export const packageNameMetric: ColorMetric = new ColorMetric("package", "NONE", "Package Name",
    "Every house is assigned a color, depending on it's containing package or namespace.");

/* #################################### *
 * ## Metrics available in SonarQube ## *
 * #################################### */

export const violationMetric: ColorMetric = new ColorMetric("violations", "INT", "Issues",
    "Scale from green (no open violations) to red (highest number of violations).");

export const linesOfCodeMetric: ColorMetric = new ColorMetric("ncloc", "INT", "Lines of Code",
    "Scale from green (few lines of code) to red (a lot of lines of code).");

export const newIssuesMetric: ColorMetric = new ColorMetric("new_violations", "INT", "New Issues",
    "Scale from green (no new issues) to red (highest number of new issues).");

export const newLinesToCoverMetric: Metric = new Metric("new_lines_to_cover", "INT", "Lines to Cover on New Code");

export const newLinesOfCodeMetric: Metric = new Metric("new_lines", "INT", "Lines on New Code");

export const complexityMetric: ColorMetric = new ColorMetric("complexity", "INT", "Complexity",
    "Scale from green (low complexity) to red (high complexity).");

export const coverageMetric: ColorMetric = new ColorMetric("coverage", "PERCENT", "Coverage",
    "Scale from green (high coverage) to red (low or no coverage).");

export const openIssuesMetric: ColorMetric = new ColorMetric("open_issues", "INT", "Open Issues",
    "Scale from green (no open issues) to red (a lot of issues).");

export const duplicatedLinesOfCodeMetric: Metric = new Metric("duplicated_lines", "INT", "Duplicated Lines");

export class ColorMetrics {

    public static availableColorMetrics: ColorMetric[] = [
        noMetric,
        complexityMetric,
        coverageMetric,
        violationMetric,
        newIssuesMetric,
        linesOfCodeMetric,
        openIssuesMetric,
        packageNameMetric
    ];

    public static getColorMetricById(id: string): ColorMetric | undefined {
        for (let availableColorMetric of ColorMetrics.availableColorMetrics) {
            if (availableColorMetric.id === id) {
                return availableColorMetric;
            }
        }
    }

}