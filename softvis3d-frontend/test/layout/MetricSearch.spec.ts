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

import { expect } from "chai";
import { MetricSearch } from "../../src/layout/MetricSearch";

describe("MetricSearch", () => {
    const genericMetric: Metric = {
        key: "generic",
        type: "INT",
        name: "Generic Metric"
    };

    it("should filter empty list", () => {
        let metrics: Metric[] = [];
        let result: Metric[] = MetricSearch.filterMetrics(metrics);

        expect(result.length).to.be.equal(0);
    });

    it("should not filter integer", () => {
        let metrics: Metric[] = [];
        metrics.push(Object.assign({}, genericMetric, {type: "INT"}));
        let result: Metric[] = MetricSearch.filterMetrics(metrics);

        expect(result.length).to.be.equal(1);
    });

    it("should filter wrong value", () => {
        let metrics: Metric[] = [];
        metrics.push(Object.assign({}, genericMetric, {type: "XXX"}));
        let result: Metric[] = MetricSearch.filterMetrics(metrics);

        expect(result.length).to.be.equal(0);
    });

    it("should filter multiple values", () => {
        let metrics: Metric[] = [];
        metrics.push(Object.assign({}, genericMetric, {type: "XXX"}));
        metrics.push(Object.assign({}, genericMetric, {type: "FLOAT"}));
        let result: Metric[] = MetricSearch.filterMetrics(metrics);

        expect(result.length).to.be.equal(1);
    });

    it("should not find metric name by key", () => {
        let key: string = "abc";
        let expectedName: string = "expectedName" ;

        let availableMetrics: Metric[] = [];
        availableMetrics.push(Object.assign({}, genericMetric, {type: "XXX", name: expectedName}));
        let result: string = MetricSearch.getNameForMetricKey(availableMetrics, key);

        expect(result).to.be.equal("No name found");
    });

    it("should find metric name by key", () => {
        let keyValue: string = "abc";
        let expectedName: string = "expectedName" ;

        let availableMetrics: Metric[] = [];
        availableMetrics.push(Object.assign({}, genericMetric, {key: keyValue, name: expectedName}));
        let result: string = MetricSearch.getNameForMetricKey(availableMetrics, keyValue);

        expect(result).to.be.equal(expectedName);
    });
});
