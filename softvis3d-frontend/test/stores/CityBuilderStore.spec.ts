///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
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
import Metric from "../../src/classes/Metric";
import { DEFAULT_BUILDING_COLOR_THEME } from "../../src/constants/BuildingColorThemes";
import { district, evostreet } from "../../src/constants/Layouts";
import * as Metrics from "../../src/constants/Metrics";
import {
    defaultDistrict,
    defaultEvostreet,
    placeholder,
} from "../../src/constants/PreviewPictures";
import { custom, defaultProfile, leakPeriod } from "../../src/constants/Profiles";
import { LINEAR_SCALED, LOGARITHMIC } from "../../src/constants/Scales";
import { DEFAULT_COLOR_THEME } from "../../src/constants/SceneColorThemes";
import CityBuilderStore from "../../src/stores/CityBuilderStore";

describe("CityBuilderStore", () => {
    it("should have set all default values on init", () => {
        const underTest: CityBuilderStore = new CityBuilderStore();
        expect(underTest.options.layout).to.be.eq(evostreet);
        expect(underTest.options.profile.id).to.be.eq(defaultProfile.id);
        expect(underTest.options.metricColor).to.be.eq(Metrics.noColorMetric);
        expect(underTest.colorMetrics.keys.length).to.be.eq(9);
        expect(underTest.initiateBuildProcess).to.be.eq(false);
        expect(underTest.show).to.be.eq(true);
        expect(underTest.options.buildingColorTheme).to.be.eq(DEFAULT_BUILDING_COLOR_THEME);
        expect(underTest.options.colorTheme).to.be.eq(DEFAULT_COLOR_THEME);
    });

    it("should set layout", () => {
        const underTest: CityBuilderStore = new CityBuilderStore();

        underTest.options.layout = district;
        expect(underTest.options.layout).to.be.equal(district);

        underTest.options.layout = evostreet;
        expect(underTest.options.layout).to.be.equal(evostreet);
    });

    it("should set profile", () => {
        const underTest: CityBuilderStore = new CityBuilderStore();
        underTest.options.profile = defaultProfile;
        expect(underTest.options.profile.id).to.be.equal(defaultProfile.id);
    });

    it("should set profile if already set", () => {
        const underTest: CityBuilderStore = new CityBuilderStore();
        underTest.options.profile = defaultProfile;
        underTest.options.profile = defaultProfile;
        expect(underTest.options.profile.id).to.be.equal(defaultProfile.id);
    });

    it("should update custom profile", () => {
        const underTest: CityBuilderStore = new CityBuilderStore();
        underTest.setProfile(leakPeriod);
        underTest.setProfile(custom);
        expect(underTest.options.profile).to.be.equal(custom);
        expect(leakPeriod.heightMetric).to.be.equal(custom.heightMetric);
        expect(leakPeriod.footprintMetric).to.be.equal(custom.footprintMetric);
        expect(leakPeriod.scale).to.be.equal(custom.scale);
    });

    it("should update scale profile but set default again", () => {
        const underTest: CityBuilderStore = new CityBuilderStore();
        expect(underTest.options.profile.id).to.be.equal(defaultProfile.id);
        expect(underTest.options.profile.scale).to.be.equal(LOGARITHMIC);
        underTest.options.profile.scale = LINEAR_SCALED;

        expect(underTest.options.profile.scale).to.be.equal(LINEAR_SCALED);

        underTest.options.profile = defaultProfile;

        expect(underTest.options.profile.scale).to.be.equal(defaultProfile.scale);
    });

    it("should set and get generic metrics", () => {
        const underTest: CityBuilderStore = new CityBuilderStore();
        const expectedMetrics: Metric[] = [];
        expectedMetrics.push(new Metric("1", "1", ""));
        expectedMetrics.push(new Metric("2", "2", ""));

        expect(underTest.genericMetrics.length).to.be.equal(0);
        underTest.genericMetrics.addMetrics(expectedMetrics);
        expect(underTest.genericMetrics.length).to.be.equal(2);

        underTest.genericMetrics.addMetric(new Metric("3", "3", ""));
        expect(underTest.genericMetrics.length).to.be.equal(3);
    });

    it("should get color metrics", () => {
        const underTest: CityBuilderStore = new CityBuilderStore();
        expect(underTest.colorMetrics.length).to.be.equal(9);
    });

    it("should get preview picture default profile and layout district", () => {
        const underTest: CityBuilderStore = new CityBuilderStore();
        underTest.options.layout = district;
        underTest.options.profile = defaultProfile;
        expect(underTest.getPreviewBackground()).to.be.equal(defaultDistrict);
    });

    it("should get preview picture default profile and layout  evostreets", () => {
        const underTest: CityBuilderStore = new CityBuilderStore();
        underTest.options.layout = evostreet;
        underTest.options.profile = defaultProfile;
        expect(underTest.getPreviewBackground()).to.be.equal(defaultEvostreet);
    });

    it("should get placeholder preview picture", () => {
        const underTest: CityBuilderStore = new CityBuilderStore();
        underTest.options.layout = district;
        underTest.options.profile = custom;
        expect(underTest.getPreviewBackground()).to.be.equal(placeholder);
    });
});
