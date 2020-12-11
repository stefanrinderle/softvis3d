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

import { assert, expect } from "chai";
import BuildingColorTheme from "../../src/classes/BuildingColorTheme";
import FileFilter from "../../src/classes/FileFilter";
import Layout from "../../src/classes/Layout";
import Metric from "../../src/classes/Metric";
import Profile from "../../src/classes/Profile";
import { SceneColorTheme } from "../../src/classes/SceneColorTheme";
import VisualizationOptionStore from "../../src/stores/VisualizationOptionStore";
import { DEFAULT_BUILDING_COLOR_THEME } from "../../src/constants/BuildingColorThemes";
import { evostreet } from "../../src/constants/Layouts";
import { coverageColorMetric, noColorMetric } from "../../src/constants/Metrics";
import { custom, defaultProfile, leakPeriod } from "../../src/constants/Profiles";
import { EXPONENTIAL, LINEAR_SCALED, LOGARITHMIC } from "../../src/constants/Scales";
import { DEFAULT_COLOR_THEME } from "../../src/constants/SceneColorThemes";

describe("VisualizationOptionStore", () => {
    it("should construct config", () => {
        const metricColor: Metric = coverageColorMetric;
        const layout: Layout = evostreet;
        const buildingColorTheme: BuildingColorTheme = DEFAULT_BUILDING_COLOR_THEME;
        const profile: Profile = defaultProfile.clone();
        const colorTheme: SceneColorTheme = DEFAULT_COLOR_THEME;
        const fileFilter = new FileFilter();

        const result: VisualizationOptionStore = new VisualizationOptionStore(
            profile,
            layout,
            metricColor,
            buildingColorTheme,
            colorTheme,
            fileFilter
        );

        expect(result.profile).to.be.eq(profile);
        expect(result.layout).to.be.eq(layout);
        expect(result.metricColor).to.be.eq(metricColor);
        expect(result.buildingColorTheme).to.be.eq(buildingColorTheme);
        expect(result.colorTheme).to.be.eq(colorTheme);
        expect(result.fileFilter).to.be.eq(fileFilter);
    });

    it("should create default config", () => {
        const metricColor: Metric = noColorMetric;
        const layout: Layout = evostreet;

        const result: VisualizationOptionStore = VisualizationOptionStore.createDefault();

        expect(result.profile).to.be.eql(defaultProfile);
        expect(result.layout).to.be.eq(layout);
        expect(result.metricColor).to.be.eq(metricColor);
        expect(result.buildingColorTheme).to.be.eq(DEFAULT_BUILDING_COLOR_THEME);
        expect(result.colorTheme).to.be.eq(DEFAULT_COLOR_THEME);
    });

    it("should check equals without color", () => {
        const result: VisualizationOptionStore = VisualizationOptionStore.createDefault();

        assert(result.equalStructure(result));

        const copy: VisualizationOptionStore = VisualizationOptionStore.createDefault();

        assert(result.equalStructure(copy));
        assert(copy.equalStructure(result));

        copy.metricColor = coverageColorMetric;

        assert(result.equalStructure(copy));
        assert(copy.equalStructure(result));

        copy.profile.scale = EXPONENTIAL;

        expect(result.equalStructure(copy)).to.be.false;
        expect(copy.equalStructure(result)).to.be.false;
    });

    it("should update custom profile", () => {
        const underTest: VisualizationOptionStore = VisualizationOptionStore.createDefault();
        underTest.setProfile(leakPeriod);
        underTest.setProfile(custom);
        expect(underTest.profile).to.be.equal(custom);
        expect(leakPeriod.heightMetric).to.be.equal(custom.heightMetric);
        expect(leakPeriod.footprintMetric).to.be.equal(custom.footprintMetric);
        expect(leakPeriod.scale).to.be.equal(custom.scale);
    });

    it("should update scale profile but set default again", () => {
        const underTest: VisualizationOptionStore = VisualizationOptionStore.createDefault();
        expect(underTest.profile.id).to.be.equal(defaultProfile.id);
        expect(underTest.profile.scale).to.be.equal(LOGARITHMIC);
        underTest.profile.scale = LINEAR_SCALED;

        expect(underTest.profile.scale).to.be.equal(LINEAR_SCALED);

        underTest.profile = defaultProfile;

        expect(underTest.profile.scale).to.be.equal(defaultProfile.scale);
    });
});
