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
import {expect} from "chai";
import Metric from "../../src/classes/Metric";
import MetricSet from "../../src/classes/MetricSet";

describe("MetricSet", () => {

    it("should add metrics", () => {
        let initialMetrics: Metric[] = [];
        initialMetrics.push(new Metric("123", "siuhf", ""));

        let result: MetricSet = new MetricSet(initialMetrics);
        expect(result.keys.length).to.be.eq(1);

        let additionalMetrics: Metric[] = [];
        additionalMetrics.push(new Metric("123", "siuhf", ""));
        result.addMetrics(additionalMetrics);

        expect(result.keys.length).to.be.eq(2);
    });

    it("should return metric keys", () => {
        let initialMetrics: Metric[] = [];
        initialMetrics.push(new Metric("123", "siuhf", ""));
        initialMetrics.push(new Metric("321", "siuhf", ""));

        let result: MetricSet = new MetricSet(initialMetrics);

        expect(result.keys.length).to.be.eq(2);
        expect(result.keys[0]).to.be.eq("123");
        expect(result.keys[1]).to.be.eq("321");
    });

    it("should return select options", () => {
        let initialMetrics: Metric[] = [];
        initialMetrics.push(new Metric("123", "siuhf", ""));
        initialMetrics.push(new Metric("321", "iojsiodf", ""));

        let result: MetricSet = new MetricSet(initialMetrics);

        expect(result.asSelectOptions.length).to.be.eq(2);
        expect(result.asSelectOptions[0].label).to.be.eq("siuhf");
        expect(result.asSelectOptions[1].label).to.be.eq("iojsiodf");
    });

    it("should return metric by id", () => {
        let initialMetrics: Metric[] = [];
        initialMetrics.push(new Metric("123", "siuhf", ""));

        let expectedKey: string = "321";
        let expectedMetric: Metric = new Metric(expectedKey, "siuhf", "");
        initialMetrics.push(expectedMetric);

        let result: MetricSet = new MetricSet(initialMetrics);

        expect(result.getMetricByKey(expectedKey)).to.be.eq(expectedMetric);
    });

    it("should return metric by id but not found", () => {
        let initialMetrics: Metric[] = [];
        initialMetrics.push(new Metric("123", "siuhf", ""));

        let result: MetricSet = new MetricSet(initialMetrics);

        expect(result.getMetricByKey("not known")).to.be.undefined;
    });
});