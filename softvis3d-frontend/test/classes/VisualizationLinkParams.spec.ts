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
import Layout from "../../src/classes/Layout";
import { evostreet } from "../../src/constants/Layouts";
import Scale from "../../src/classes/Scale";
import { complexityMetricId, coverageColorMetric, linesOfCodeMetricId } from "../../src/constants/Metrics";
import Metric from "../../src/classes/Metric";
import { Scales } from "../../src/constants/Scales";
import VisualizationLinkParams from "../../src/classes/VisualizationLinkParams";
import { Parameters } from "../../src/services/UrlParameterService";
import { Vector3 } from "three";
import { SceneColorTheme } from "../../src/classes/SceneColorTheme";
import { SceneColorThemes } from "../../src/constants/SceneColorThemes";

describe("VisualizationLinkParams", () => {

    it("should construct config", () => {
        let metricFootprintId: string = complexityMetricId;
        let metricHeightId: string = linesOfCodeMetricId;
        let metricColor: Metric = coverageColorMetric;
        let scalingMethod: Scale = Scales.availableScales[0];
        let layout: Layout = evostreet;
        let selectedObjectId: string = "123";
        let cameraPosition: Vector3 = new Vector3(0, 1, 2);
        let colorTheme: SceneColorTheme = SceneColorThemes.availableColorThemes[0];

        let result: VisualizationLinkParams =
            new VisualizationLinkParams(metricFootprintId, metricHeightId, metricColor, layout, scalingMethod,
                                        selectedObjectId, cameraPosition, colorTheme);

        expect(result.layout).to.be.eq(layout);
        expect(result.metricFootprintId).to.be.eq(metricFootprintId);
        expect(result.metricHeightId).to.be.eq(metricHeightId);
        expect(result.metricColor).to.be.eq(metricColor);
        expect(result.scale).to.be.eq(scalingMethod);
        expect(result.selectedObjectId).to.be.eq(selectedObjectId);
        expect(result.cameraPosition).to.be.eq(cameraPosition);
        expect(result.colorTheme).to.be.eq(SceneColorThemes.availableColorThemes[0]);
    });

    it("should create default config", () => {
        let complexityFootprintId: string = complexityMetricId;
        let metricHeightId: string = linesOfCodeMetricId;
        let metricColor: Metric = coverageColorMetric;
        let scalingMethod: Scale = Scales.availableScales[0];
        let layout: Layout = evostreet;
        let selectedObjectId: string = "123";
        let cameraPosition: Vector3 = new Vector3(0.34, 1.23, 2);
        let colorTheme: SceneColorTheme = SceneColorThemes.availableColorThemes[0];

        let result: VisualizationLinkParams =
            new VisualizationLinkParams(complexityFootprintId, metricHeightId, metricColor, layout, scalingMethod,
                                        selectedObjectId, cameraPosition, colorTheme);

        let pairs: Parameters = result.getKeyValuePairs();

        let expected: Parameters = {
            metricFootprint: "complexity",
            metricHeight: "ncloc",
            metricColor: "coverage",
            layout: "evostreet",
            scale: "logarithmic",
            cameraX: "0",
            cameraY: "1",
            cameraZ: "2",
            colorTheme: "default",
            selectedObjectId: "123"
        };

        expect(JSON.stringify(pairs)).to.be.eq(JSON.stringify(expected));
    });

    it("should create only mandatory", () => {
        let metricFootprintId: string = complexityMetricId;
        let metricHeightId: string = linesOfCodeMetricId;
        let metricColor: Metric = coverageColorMetric;
        let scalingMethod: Scale = Scales.availableScales[0];
        let layout: Layout = evostreet;
        let selectedObjectId: string | null = null;
        let cameraPosition: Vector3 = new Vector3(0.34, 1.23, 2);
        let colorTheme: SceneColorTheme = SceneColorThemes.availableColorThemes[1];

        let result: VisualizationLinkParams =
            new VisualizationLinkParams(metricFootprintId, metricHeightId, metricColor, layout, scalingMethod,
                selectedObjectId, cameraPosition, colorTheme);

        let pairs: Parameters = result.getKeyValuePairs();

        let expected: Parameters = {
            metricFootprint: "complexity",
            metricHeight: "ncloc",
            metricColor: "coverage",
            layout: "evostreet",
            scale: "logarithmic",
            cameraX: "0",
            cameraY: "1",
            cameraZ: "2",
            colorTheme: "dark"
        };

        expect(JSON.stringify(pairs)).to.be.eq(JSON.stringify(expected));
    });

});