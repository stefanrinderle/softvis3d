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
import {Vector3} from "three";
import VisualizationLinkParams from "../../src/classes/VisualizationLinkParams";
import VisualizationOptions from "../../src/classes/VisualizationOptions";
import {Parameters} from "../../src/services/UrlParameterService";

describe("VisualizationLinkParams", () => {

    it("should construct config", () => {
        let selectedObjectId: string = "123";
        let cameraPosition: Vector3 = new Vector3(0, 1, 2);
        let visualizationOptions = VisualizationOptions.createDefault();

        let result: VisualizationLinkParams =
            new VisualizationLinkParams(visualizationOptions, selectedObjectId, cameraPosition);

        expect(result.visualizationOptions).to.be.eq(visualizationOptions);
        expect(result.selectedObjectId).to.be.eq(selectedObjectId);
        expect(result.cameraPosition).to.be.eq(cameraPosition);
    });

    it("should create default config", () => {
        let selectedObjectId: string = "123";
        let cameraPosition: Vector3 = new Vector3(0, 1, 2);
        let visualizationOptions = VisualizationOptions.createDefault();

        let result: VisualizationLinkParams =
            new VisualizationLinkParams(visualizationOptions, selectedObjectId, cameraPosition);

        let pairs: Parameters = result.getKeyValuePairs();

        let expected: Parameters = {
            metricFootprint: "complexity",
            metricHeight: "ncloc",
            metricColor: "none",
            layout: "evostreet",
            scale: "logarithmic",
            cameraX: "0",
            cameraY: "1",
            cameraZ: "2",
            colorTheme: "default",
            buildingColorTheme: "default",
            selectedObjectId: "123"
        };

        expect(JSON.stringify(pairs)).to.be.eq(JSON.stringify(expected));
    });

    it("should create only mandatory", () => {
        let selectedObjectId: string | null = null;
        let cameraPosition: Vector3 = new Vector3(0.34, 1.23, 2);
        let visualizationOptions = VisualizationOptions.createDefault();

        let result: VisualizationLinkParams =
            new VisualizationLinkParams(visualizationOptions, selectedObjectId, cameraPosition);

        let pairs: Parameters = result.getKeyValuePairs();

        let expected: Parameters = {
            metricFootprint: "complexity",
            metricHeight: "ncloc",
            metricColor: "none",
            layout: "evostreet",
            scale: "logarithmic",
            cameraX: "0",
            cameraY: "1",
            cameraZ: "2",
            colorTheme: "default",
            buildingColorTheme: "default"
        };

        expect(JSON.stringify(pairs)).to.be.eq(JSON.stringify(expected));
    });

});