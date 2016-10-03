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

export interface Metric {
    type?: string;
    key?: string;
    name?: string;
}

export class MetricSearch {

    public static filterMetrics(metrics: Metric[]): Metric[] {
        let result: Metric[] = [];

        for (let index: number = 0; index < metrics.length; index++) {
            // check if numeric!
            if (metrics[index].type === "INT" || metrics[index].type === "PERCENT"
                || metrics[index].type === "FLOAT" || metrics[index].type === "RATING" ) {
                result.push(metrics[index]);
            }
        }

        return result;
    }

    public static getNameForMetricKey(availableMetrics: Metric[], metricKey: string): string {
        for (let index: number = 0; index < availableMetrics.length; index++) {
            if (availableMetrics[index].key === metricKey) {
                return availableMetrics[index].name;
            }
        }

        return "No name found";
    }

}