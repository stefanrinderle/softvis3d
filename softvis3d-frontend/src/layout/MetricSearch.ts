///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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

export class MetricSearch {

    public static filterMetrics(metrics: Metric[]): Metric[] {
        let result: Metric[] = [];

        for (let metric of metrics) {
            switch (metric.type) {
                case "INT":
                case "PERCENT":
                case "FLOAT":
                case "RATING":
                    result.push(metric);
                    break;
                default:
                    // No Action!
                    break;
            }
        }

        return result;
    }

    public static getNameForMetricKey(availableMetrics: Metric[], metricKey: string): string {
        for (let metric of availableMetrics) {
            if (metric.key === metricKey) {
                return metric.name;
            }
        }

        return "No name found";
    }

}