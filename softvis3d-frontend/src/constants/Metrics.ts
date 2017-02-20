/* #################################### *
 * ##         Custom Metrics         ## *
 * #################################### */

import Metric from "../classes/Metric";
import ColorMetric from "../classes/ColorMetric";

export const noMetric: ColorMetric = new ColorMetric("none", "NONE", " -- None -- ",
    "The building color can be changed dynamically in the view using the combo box in the bottom bar.");

export const packageNameMetric: ColorMetric = new ColorMetric("package", "NONE", "Package Name",
    "Every package gets a random color.");

/* #################################### *
 * ## Metrics available in SonarQube ## *
 * #################################### */

export const violationMetric: ColorMetric = new ColorMetric("violations", "INT", "Issues",
    "Scale from green, no open violations, to red, highest number of violations.");

export const linesOfCodeMetric: ColorMetric = new ColorMetric("ncloc", "INT", "Lines of Code",
    "Scale from green to red with the number of lines.");

export const newIssuesMetric: ColorMetric = new ColorMetric("new_violations", "INT", "New Issues",
    "Scale from green, no new issues, to red, highest number of new issues.");

export const newLinesToCoverMetric: Metric = new Metric("new_lines_to_cover", "INT", "Lines to Cover on New Code");

export const newLinesOfCodeMetric: Metric = new Metric("new_lines", "INT", "Lines on New Code");

export const complexityMetric: ColorMetric = new ColorMetric("complexity", "INT", "Complexity",
    "Scale from green, low complexity, to red, high complexity.");

export const coverageMetric: ColorMetric = new ColorMetric("coverage", "PERCENT", "Coverage",
    "Scale from green, high coverage, to red, no or low coverage.");

export const openIssuesMetric: ColorMetric = new ColorMetric("open_issues", "INT", "Open Issues",
    "Scale from green, no open issues, to red, highest number of issues.");

export const duplicatedLinesOfCodeMetric: Metric = new Metric("duplicated_lines", "INT", "Duplicated Lines");

export const availableColorMetrics: ColorMetric[] = [
    noMetric,
    complexityMetric,
    coverageMetric,
    violationMetric,
    newIssuesMetric,
    linesOfCodeMetric,
    openIssuesMetric,
    packageNameMetric
];