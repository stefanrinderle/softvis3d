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
import VisualizationOptions from "../../src/classes/VisualizationOptions";
import { DEFAULT_BUILDING_COLOR_THEME } from "../../src/constants/BuildingColorThemes";
import { evostreet } from "../../src/constants/Layouts";
import { coverageColorMetric, noColorMetric } from "../../src/constants/Metrics";
import { defaultProfile } from "../../src/constants/Profiles";
import { EXPONENTIAL } from "../../src/constants/Scales";
import { DEFAULT_COLOR_THEME } from "../../src/constants/SceneColorThemes";

describe("VisualizationOptions", () => {
    it("should construct config", () => {
        const metricColor: Metric = coverageColorMetric;
        const layout: Layout = evostreet;
        const buildingColorTheme: BuildingColorTheme = DEFAULT_BUILDING_COLOR_THEME;
        const profile: Profile = defaultProfile.clone();
        const colorTheme: SceneColorTheme = DEFAULT_COLOR_THEME;
        const fileFilter = new FileFilter();

        const result: VisualizationOptions = new VisualizationOptions(
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

        const result: VisualizationOptions = VisualizationOptions.createDefault();

        expect(result.profile).to.be.eql(defaultProfile);
        expect(result.layout).to.be.eq(layout);
        expect(result.metricColor).to.be.eq(metricColor);
        expect(result.buildingColorTheme).to.be.eq(DEFAULT_BUILDING_COLOR_THEME);
        expect(result.colorTheme).to.be.eq(DEFAULT_COLOR_THEME);
    });

    it("should check equals without color", () => {
        const result: VisualizationOptions = VisualizationOptions.createDefault();

        assert(result.equalStructure(result));

        const copy: VisualizationOptions = VisualizationOptions.createDefault();

        assert(result.equalStructure(copy));
        assert(copy.equalStructure(result));

        copy.metricColor = coverageColorMetric;

        assert(result.equalStructure(copy));
        assert(copy.equalStructure(result));

        copy.profile.scale = EXPONENTIAL;

        expect(result.equalStructure(copy)).to.be.false;
        expect(copy.equalStructure(result)).to.be.false;
    });
});
