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
import { noColorMetric } from "../../src/constants/ColorMetrics";
import { district, evostreet } from "../../src/constants/Layouts";
import { defaultProfile } from "../../src/constants/Profiles";
import { DEFAULT_COLOR_THEME } from "../../src/constants/SceneColorThemes";
import CityBuilderStore from "../../src/stores/CityBuilderStore";

describe("CityBuilderStore", () => {
    it("should have set all default values on init", () => {
        const underTest: CityBuilderStore = new CityBuilderStore();
        expect(underTest.options.layout).to.be.eq(evostreet);
        expect(underTest.options.profile.id).to.be.eq(defaultProfile.id);
        expect(underTest.options.metricColor).to.be.eq(noColorMetric);
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
});
