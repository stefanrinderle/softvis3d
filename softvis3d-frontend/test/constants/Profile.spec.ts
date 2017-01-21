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
import {ProfileBuilder, Profile} from "../../src/constants/Profile";
import {complexityMetric, linesOfCodeMetric} from "../../src/constants/Metrics";
import LayoutProcessor from "../../src/legacy/LayoutProcessor";

describe("Profile", () => {

    it("should be build with builder", () => {
        let expectedId = "123";
        let expectedName = "ydydf";
        let expectedDescription = "sdoihffishd";
        let profile: Profile = new ProfileBuilder(expectedId, expectedName)
            .withConfiguration(complexityMetric, linesOfCodeMetric, LayoutProcessor.SCALING_METHODS[0])
            .withDescription(expectedDescription)
            .build();

        expect(profile.id).to.be.eq(expectedId);
        expect(profile.metricWidth).to.be.eq(complexityMetric);
        expect(profile.metricHeight).to.be.eq(linesOfCodeMetric);
        expect(profile.scale).to.be.eq(LayoutProcessor.SCALING_METHODS[0]);

        expect(profile.description).to.be.eq(expectedDescription);
    });

    it("should implement SelectOptionValue", () => {
        let expectedId = "123";
        let expectedName = "ydydf";
        let expectedDescription = "sdoihffishd";
        let profile: Profile = new ProfileBuilder(expectedId, expectedName)
            .withConfiguration(complexityMetric, linesOfCodeMetric, LayoutProcessor.SCALING_METHODS[0])
            .withDescription(expectedDescription)
            .build();

        expect(profile.getLabel()).to.be.eq(expectedName);
    });

});
