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
import Metric from "../../src/constants/Metric";
import MetricSet from "../../src/constants/MetricSet";

describe("MetricSet", () => {

    it("should add metrics", () => {
        let initialMetrics: Metric[] = [];
        initialMetrics.push(new Metric("123", "INT", "siuhf"));

        let result: MetricSet = new MetricSet(initialMetrics);
        expect(result.getKeys().length).to.be.eq(1);

        let additionalMetrics: Metric[] = [];
        additionalMetrics.push(new Metric("123", "INT", "siuhf"));
        result.addMetrics(additionalMetrics);

        expect(result.getKeys().length).to.be.eq(2);
    });

    it("should return metric keys", () => {
        let initialMetrics: Metric[] = [];
        initialMetrics.push(new Metric("123", "INT", "siuhf"));
        initialMetrics.push(new Metric("321", "INT", "siuhf"));

        let result: MetricSet = new MetricSet(initialMetrics);

        expect(result.getKeys().length).to.be.eq(2);
        expect(result.getKeys()[0]).to.be.eq("123");
        expect(result.getKeys()[1]).to.be.eq("321");
    });

    it("should return select options", () => {
        let initialMetrics: Metric[] = [];
        initialMetrics.push(new Metric("123", "INT", "siuhf"));
        initialMetrics.push(new Metric("321", "INT", "iojsiodf"));

        let result: MetricSet = new MetricSet(initialMetrics);

        expect(result.getSelectOptions().length).to.be.eq(2);
        expect(result.getSelectOptions()[0].getLabel()).to.be.eq("siuhf");
        expect(result.getSelectOptions()[1].getLabel()).to.be.eq("iojsiodf");
    });

});