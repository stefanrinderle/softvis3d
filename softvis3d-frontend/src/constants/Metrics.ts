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

/* #################################### *
 * ##         Custom Metrics         ## *
 * #################################### */

import Metric from "../classes/Metric";
import { MetricType } from "../classes/MetricType";

export const complexityMetric = new Metric(
    "complexity",
    "Cyclomatic Complexity",
    "Cyclomatic complexity",
    MetricType.INT
);
export const linesOfCodeMetric = new Metric(
    "ncloc",
    "Lines of Code",
    "Non commenting lines of code",
    MetricType.INT
);
export const newLinesOfCodeMetric = new Metric(
    "new_lines",
    "New Lines",
    "New Lines",
    MetricType.INT
);
export const duplicatedLinesOfCodeMetric = new Metric(
    "duplicated_lines",
    "Duplicated Lines",
    "Duplicated Lines",
    MetricType.INT
);
export const noMetric = new Metric("none", "-- None --", "", MetricType.UNKNOWN);

export const coverageMetricId = "coverage";
