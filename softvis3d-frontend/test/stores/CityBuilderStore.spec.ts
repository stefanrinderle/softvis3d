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
import { district, evostreet } from "../../src/constants/Layouts";
import { custom, defaultProfile, leakPeriod } from "../../src/constants/Profiles";
import * as Metrics from "../../src/constants/Metrics";
import { CityBuilderStore } from "../../src/stores/CityBuilderStore";
import Metric from "../../src/classes/Metric";
import { defaultDistrict, defaultEvostreet, placeholder } from "../../src/constants/PreviewPictures";
import { LINEAR_SCALED, LOGARITHMIC } from "../../src/constants/Scales";

describe("CityBuilderStore", () => {

    it("should have set all default values on init", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        expect(underTest.layout).to.be.eq(evostreet);
        expect(underTest.profile.id).to.be.eq(defaultProfile.id);
        expect(underTest.metricColor).to.be.eq(Metrics.noColorMetric);
        expect(underTest.colorMetrics.keys.length).to.be.eq(9);
        expect(underTest.initiateBuildProcess).to.be.eq(false);
        expect(underTest.show).to.be.eq(true);
    });

    it("should set layout", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();

        underTest.layout = district;
        expect(underTest.layout).to.be.equal(district);

        underTest.layout = evostreet;
        expect(underTest.layout).to.be.equal(evostreet);
    });

    it("should set profile", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        underTest.profile = defaultProfile;
        expect(underTest.profile.id).to.be.equal(defaultProfile.id);
    });

    it("should set profile if already set", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        underTest.profile = defaultProfile;
        underTest.profile = defaultProfile;
        expect(underTest.profile.id).to.be.equal(defaultProfile.id);
    });

    it("should update custom profile", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        underTest.profile = leakPeriod;
        underTest.profile = custom;
        expect(underTest.profile.id).to.be.equal(custom.id);
        expect(leakPeriod.heightMetricId).to.be.equal(custom.heightMetricId);
        expect(leakPeriod.footprintMetricId).to.be.equal(custom.footprintMetricId);
        expect(leakPeriod.scale).to.be.equal(custom.scale);
    });

    it("should update scale profile but set default again", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        expect(underTest.profile.id).to.be.equal(defaultProfile.id);
        expect(underTest.profile.scale).to.be.equal(LOGARITHMIC);
        underTest.profile.scale = LINEAR_SCALED;

        expect(underTest.profile.scale).to.be.equal(LINEAR_SCALED);

        underTest.profile = defaultProfile;

        expect(underTest.profile.scale).to.be.equal(defaultProfile.scale);
    });

    it("should set and get generic metrics", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        let expectedMetrics: Metric[] = [];
        expectedMetrics.push(new Metric("1", "1", ""));
        expectedMetrics.push(new Metric("2", "2", ""));

        expect(underTest.genericMetrics.length).to.be.equal(0);
        underTest.genericMetrics.addMetrics(expectedMetrics);
        expect(underTest.genericMetrics.length).to.be.equal(2);

        underTest.genericMetrics.addMetric(new Metric("3", "3", ""));
        expect(underTest.genericMetrics.length).to.be.equal(3);
    });

    it("should get color metrics", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        expect(underTest.colorMetrics.length).to.be.equal(9);
    });

    it("should get preview picture default profile and layout district", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        underTest.layout = district;
        underTest.profile = defaultProfile;
        expect(underTest.getPreviewBackground()).to.be.equal(defaultDistrict);
    });

    it("should get preview picture default profile and layout  evostreets", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        underTest.layout = evostreet;
        underTest.profile = defaultProfile;
        expect(underTest.getPreviewBackground()).to.be.equal(defaultEvostreet);
    });

    it("should get placeholder preview picture", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        underTest.layout = district;
        underTest.profile = custom;
        expect(underTest.getPreviewBackground()).to.be.equal(placeholder);
    });

});