///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import Metric from "../classes/Metric";
import MetricSet from "../classes/MetricSet";
import { complexityMetric, coverageMetricId, linesOfCodeMetric, noMetric } from "./Metrics";

/* ############################################################# *
 * ## Color metric definitions with color descriptions        ## *
 * ## should only used for color metric settings and options. ## *
 * ############################################################# */

export const noColorMetric: Metric = new Metric(
    noMetric.id,
    noMetric.label,
    "All buildings will have the same color."
);

export const packageNameColorMetric: Metric = new Metric(
    "package",
    "Package Name",
    "Every building is assigned a color, depending on it's containing package or namespace."
);

export const violationsColorMetric: Metric = new Metric(
    "violations",
    "Issues",
    "Scale from green (no open violations) to red (highest number of violations)."
);

export const linesOfCodeColorMetric: Metric = new Metric(
    linesOfCodeMetric.id,
    "Lines of Code",
    "Scale from green (few lines of code) to red (a lot of lines of code)."
);

export const newIssuesColorMetric: Metric = new Metric(
    "new_violations",
    "New Issues",
    "Scale from green (no new issues) to red (highest number of new issues)."
);

export const complexityColorMetric: Metric = new Metric(
    complexityMetric.id,
    "Complexity",
    "Scale from green (low complexity) to red (high complexity)."
);

export const coverageColorMetric: Metric = new Metric(
    coverageMetricId,
    "Coverage",
    "Scale from green (high coverage) to red (low or no coverage)."
);

export const openIssuesColorMetric: Metric = new Metric(
    "open_issues",
    "Open Issues",
    "Scale from green (no open issues) to red (a lot of issues)."
);

export const numberOfAuthorsScmColorMetric: Metric = new Metric(
    "number_of_authors",
    "Number of authors",
    "Number of authors based on the SCM info."
);

export const leakPeriodCommitsScmColorMetric: Metric = new Metric(
    "number_of_commits",
    "Number of commits",
    "Number of commits during the current leak period."
);

export class ColorMetrics {
    public static availableColorMetrics: Metric[] = [
        noColorMetric,
        complexityColorMetric,
        coverageColorMetric,
        numberOfAuthorsScmColorMetric,
        leakPeriodCommitsScmColorMetric,
        violationsColorMetric,
        newIssuesColorMetric,
        linesOfCodeColorMetric,
        openIssuesColorMetric,
        packageNameColorMetric,
    ];

    public static readonly colorMetrics: MetricSet = new MetricSet(
        ColorMetrics.availableColorMetrics
    );

    public static getColorMetricById(id: string): Metric | undefined {
        for (const availableColorMetric of ColorMetrics.availableColorMetrics) {
            if (availableColorMetric.id === id) {
                return availableColorMetric;
            }
        }
    }

    public static isScmColorMetric(metricColor: Metric) {
        return (
            metricColor.id === numberOfAuthorsScmColorMetric.id ||
            metricColor.id === leakPeriodCommitsScmColorMetric.id
        );
    }
}
