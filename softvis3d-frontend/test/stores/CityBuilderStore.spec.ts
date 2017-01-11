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
import {CityBuilderStore} from "../../src/stores/CityBuilderStore";
import {district, evostreet} from "../../src/constants/Layouts";
import {defaultProfile, custom} from "../../src/constants/Profiles";
import * as Metrics from "../../src/constants/Metrics";

describe("CityBuilderStore", () => {

    it("should have set all default values on init", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        expect(underTest.layoutType).to.be.eq(district);
        expect(underTest.profile).to.be.eq(defaultProfile);
        expect(underTest.metricColor).to.be.eq(Metrics.noMetric);
        expect(underTest.availableColorMetrics.length).to.be.eq(8);
        expect(underTest.renderButtonClicked).to.be.eq(false);
        expect(underTest.show).to.be.eq(false);

    });

    it("should choose editable profile", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        underTest.chooseEditableProfile();
        expect(underTest.profile).to.be.equal(custom);
    });

    it("should set layout", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        underTest.setLayout(evostreet);
        expect(underTest.layoutType).to.be.equal(evostreet);
    });

    it("should set and get generic metrics", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        let expectedMetrics: Metric[] = [];
        expectedMetrics.push({key: "1", type: "INT", name: "1"});
        expectedMetrics.push({key: "2", type: "FLOAT", name: "2"});

        expect(underTest.getAvailableGenericMetrics().length).to.be.equal(1);
        underTest.addGenericMetrics(expectedMetrics);
        expect(underTest.getAvailableGenericMetrics().length).to.be.equal(3);
    });

    it("should get color metrics", () => {
        let underTest: CityBuilderStore = new CityBuilderStore();
        expect(underTest.getAvailableColorMetrics().length).to.be.equal(8);
    });
});