///
import {expect} from "chai";
import {Vector3} from "three";
import VisualizationLinkParams from "../../src/classes/VisualizationLinkParams";
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
import VisualizationLinkSerializationService from "../../src/classes/VisualizationLinkSerializationService";
import VisualizationOptions from "../../src/classes/VisualizationOptions";

describe("VisualizationLinkSerializationService", () => {

    it("Round trip test", () => {
        const underTest = new VisualizationLinkSerializationService();

        const expectedX = 123;
        let linkParams = new VisualizationLinkParams(VisualizationOptions.createDefault(), null, new Vector3(expectedX));

        const urlString = underTest.serialize(linkParams);

        const result = underTest.deserialize(urlString);

        expect(result.visualizationOptions.profile.id).to.be.eq("default");
        expect(result.visualizationOptions.profile.heightMetric.id).to.be.eq("ncloc");
        expect(result.selectedObjectId).to.be.null;
        expect(result.cameraPosition.x).to.be.eq(expectedX);

        expect(result.visualizationOptions.equalStructure(result.visualizationOptions)).to.be.eq(true);
    });

});
