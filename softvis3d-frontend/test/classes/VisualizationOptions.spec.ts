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
import VisualizationConfiguration from "../../src/classes/VisualizationOptions";
import Layout from "../../src/classes/Layout";
import {evostreet, district} from "../../src/constants/Layouts";
import Scale from "../../src/classes/Scale";
import {coverageMetric, linesOfCodeMetric, complexityMetric, noMetric} from "../../src/constants/Metrics";
import Metric from "../../src/classes/Metric";
import {LOGARITHMIC, Scales} from "../../src/constants/Scales";
import ColorMetric from "../../src/classes/ColorMetric";

describe("VisualizationOptions", () => {

    it("should construct config", () => {
        let metricWidth: Metric = complexityMetric;
        let metricHeight: Metric = linesOfCodeMetric;
        let metricColor: ColorMetric = coverageMetric;
        let scalingMethod: Scale = Scales.availableScales[0];
        let layout: Layout = evostreet;

        let result: VisualizationConfiguration =
            new VisualizationConfiguration(layout, metricWidth, metricHeight, metricColor, scalingMethod);

        expect(result.layout).to.be.eq(layout);
        expect(result.footprint).to.be.eq(metricWidth);
        expect(result.height).to.be.eq(metricHeight);
        expect(result.metricColor).to.be.eq(metricColor);
        expect(result.scale).to.be.eq(scalingMethod);
    });

    it("should create default config", () => {
        let metricWidth: Metric = noMetric;
        let metricHeight: Metric = noMetric;
        let metricColor: Metric = noMetric;
        let scalingmethod: Scale = LOGARITHMIC;
        let layout: Layout = district;

        let result: VisualizationConfiguration = VisualizationConfiguration.createDefault();

        expect(result.layout).to.be.eq(layout);
        expect(result.footprint).to.be.eq(metricWidth);
        expect(result.height).to.be.eq(metricHeight);
        expect(result.metricColor).to.be.eq(metricColor);
        expect(result.scale).to.be.eq(scalingmethod);
    });

});