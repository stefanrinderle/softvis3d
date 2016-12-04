export const noMetric: Metric = {
    key: "none",
    type: "NONE",
    name: " -- None -- "
};
export const violationMetric: Metric = {
    key: "violations",
    type: "INT",
    name: "Issues"
};
export const linesOfCodeMetric: Metric = {
    key: "ncloc",
    type: "INT",
    name: "Lines of Code"
};
export const newIssuesMetric: Metric = {
    key: "new_violations",
    type: "INT",
    name: "New Issues"
};
export const newLinesOfCodeMetric: Metric = {
    key: "new_lines_to_cover",
    type: "INT",
    name: "Lines to Cover on New Code"
};
export const complexityMetric: Metric = {
    key: "complexity",
    type: "INT",
    name: "Complexity"
};