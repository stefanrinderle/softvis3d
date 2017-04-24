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
import Profile, { ProfileBuilder } from "../../src/classes/Profile";
import {
    complexityMetricId, coverageMetricId, duplicatedLinesOfCodeMetricId, linesOfCodeMetricId
} from "../../src/constants/Metrics";
import { EXPONENTIAL, Scales } from "../../src/constants/Scales";

describe("Profile", () => {

    it("should be build with builder", () => {
        let expectedId = "123";
        let expectedName = "ydydf";
        let expectedDescription = "sdoihffishd";
        let profile: Profile = new ProfileBuilder(expectedId, expectedName)
            .withConfiguration(complexityMetricId, linesOfCodeMetricId, Scales.availableScales[0])
            .withDescription(expectedDescription)
            .build();

        expect(profile.id).to.be.eq(expectedId);
        expect(profile.footprintMetricId).to.be.eq(complexityMetricId);
        expect(profile.heightMetricId).to.be.eq(linesOfCodeMetricId);
        expect(profile.scale).to.be.eq(Scales.availableScales[0]);

        expect(profile.description).to.be.eq(expectedDescription);
    });

    it("should implement SelectOptionValue", () => {
        let expectedId = "123";
        let expectedName = "ydydf";
        let expectedDescription = "sdoihffishd";
        let profile: Profile = new ProfileBuilder(expectedId, expectedName)
            .withConfiguration(complexityMetricId, linesOfCodeMetricId, Scales.availableScales[0])
            .withDescription(expectedDescription)
            .build();

        expect(profile.label).to.be.eq(expectedName);
        expect(profile.id).to.be.eq(expectedId);
    });

    it("should be able to clone", () => {
        let id = "custom";
        let name = "Customize";
        let metricWidth = complexityMetricId;
        let metricHeight = linesOfCodeMetricId;
        let scalingmethod = Scales.availableScales[0];
        let description = "sdfiuhsi";

        const test: Profile = new ProfileBuilder(id, name)
            .withConfiguration(metricWidth, metricHeight, scalingmethod)
            .withDescription(description)
            .build();

        let cloneResult: Profile = test.clone();

        expect(test).not.to.be.eq(cloneResult);

        expect(cloneResult.id).to.be.eq(id);
        expect(cloneResult.label).to.be.eq(name);
        expect(cloneResult.footprintMetricId).to.be.eq(metricWidth);
        expect(cloneResult.heightMetricId).to.be.eq(metricHeight);
        expect(cloneResult.scale).to.be.eq(scalingmethod);
        expect(cloneResult.description).to.be.eq(description);
    });

    it("should be able to update config", () => {
        let id = "custom";
        let name = "Customize";
        let metricWidth = complexityMetricId;
        let metricHeight = linesOfCodeMetricId;
        let scalingmethod = Scales.availableScales[0];
        let description = "sdfiuhsi";

        const test: Profile = new ProfileBuilder(id, name)
            .withConfiguration(metricWidth, metricHeight, scalingmethod)
            .withDescription(description)
            .build();

        let updateMetricWidth = coverageMetricId;
        let updateMetricHeight = duplicatedLinesOfCodeMetricId;
        let updateScale = EXPONENTIAL;

        test.updateConfiguration(updateMetricWidth, updateMetricHeight, updateScale);

        expect(test.id).to.be.eq(id);
        expect(test.label).to.be.eq(name);
        expect(test.footprintMetricId).to.be.eq(updateMetricWidth);
        expect(test.heightMetricId).to.be.eq(updateMetricHeight);
        expect(test.scale).to.be.eq(updateScale);
        expect(test.description).to.be.eq(description);
    });
});
