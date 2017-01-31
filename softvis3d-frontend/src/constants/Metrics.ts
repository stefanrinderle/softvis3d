/* #################################### *
 * ##         Custom Metrics         ## *
 * #################################### */

import Metric from "../classes/Metric";

export const noMetric: Metric = new Metric("none", "NONE", " -- None -- ");

export const packageNameMetric: Metric = new Metric("package", "NONE", "Package Name");

/* #################################### *
 * ## Metrics available in SonarQube ## *
 * #################################### */

export const violationMetric: Metric = new Metric("violations", "INT", "Issues");

export const linesOfCodeMetric: Metric = new Metric("ncloc", "INT", "Lines of Code");

export const newIssuesMetric: Metric = new Metric("new_violations", "INT", "New Issues");

export const newLinesToCoverMetric: Metric = new Metric("new_lines_to_cover", "INT", "Lines to Cover on New Code");

export const newLinesOfCodeMetric: Metric = new Metric("new_lines", "INT", "Lines on New Code");

export const complexityMetric: Metric = new Metric("complexity", "INT", "Complexity");

export const coverageMetric: Metric = new Metric("coverage", "PERCENT", "Coverage");

export const openIssuesMetric: Metric = new Metric("open_issues", "INT", "Open Issues");

export const duplicatedLinesOfCodeMetric: Metric = new Metric("duplicated_lines", "INT", "Duplicated Lines");

export const availableColorMetrics: Metric[] = [
    noMetric,
    complexityMetric,
    coverageMetric,
    violationMetric,
    newIssuesMetric,
    linesOfCodeMetric,
    openIssuesMetric,
    packageNameMetric
];