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
import {expect, assert} from "chai";
import Layout from "../../src/classes/Layout";
import {evostreet} from "../../src/constants/Layouts";
import Scale from "../../src/classes/Scale";
import {coverageMetric, linesOfCodeMetric, complexityMetric} from "../../src/constants/Metrics";
import Metric from "../../src/classes/Metric";
import {Scales} from "../../src/constants/Scales";
import ColorMetric from "../../src/classes/ColorMetric";
import VisualizationLinkParams from "../../src/classes/VisualizationLinkParams";
import {Parameters} from "../../src/services/VisualizationLinkService";

describe("VisualizationLinkParams", () => {

    it("should construct config", () => {
        let metricFootprint: Metric = complexityMetric;
        let metricHeight: Metric = linesOfCodeMetric;
        let metricColor: ColorMetric = coverageMetric;
        let scalingMethod: Scale = Scales.availableScales[0];
        let layout: Layout = evostreet;

        let result: VisualizationLinkParams =
            new VisualizationLinkParams(metricFootprint, metricHeight, metricColor, layout, scalingMethod);

        expect(result.layout).to.be.eq(layout);
        expect(result.metricFootprint).to.be.eq(metricFootprint);
        expect(result.metricHeight).to.be.eq(metricHeight);
        expect(result.metricColor).to.be.eq(metricColor);
        expect(result.scale).to.be.eq(scalingMethod);
    });

    it("should create default config", () => {
        let metricWidth: Metric = complexityMetric;
        let metricHeight: Metric = linesOfCodeMetric;
        let metricColor: ColorMetric = coverageMetric;
        let scalingMethod: Scale = Scales.availableScales[0];
        let layout: Layout = evostreet;

        let result: VisualizationLinkParams =
            new VisualizationLinkParams(metricHeight, metricWidth, metricColor, layout, scalingMethod);

        let pairs: Parameters = result.getKeyValuePairs();

        for (let key in pairs) {
            if (pairs[key]) {
                expect(pairs[key]).not.to.be.null;
            } else {
                assert.fail();
            }
        }
    });

});