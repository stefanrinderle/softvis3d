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
import VisualizationLinkService, {Parameters} from "../../src/services/VisualizationLinkService";
import {CityBuilderStore} from "../../src/stores/CityBuilderStore";
import Metric from "../../src/classes/Metric";
import {custom} from "../../src/constants/Profiles";
import {district, evostreet} from "../../src/constants/Layouts";
import {EXPONENTIAL, LINEAR_SCALED} from "../../src/constants/Scales";
import {coverageMetric, packageNameMetric} from "../../src/constants/Metrics";

describe("VisualizationLinkService", () => {

    it("Does nothing on empty string", () => {
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let underTest: VisualizationLinkService = new VisualizationLinkService(testCityBuilderStore);

        underTest.process("");

        expect(testCityBuilderStore.initiateBuildProcess).to.be.eq(false);
    });

    it("Extracts the parameters properly", () => {
        let underTest: VisualizationLinkService = new VisualizationLinkService(new CityBuilderStore());
        let result: Parameters = underTest.getQueryParams("?test=123&test3=bla&metricWidth=13");

        expect(result.test).to.contain("123");
        expect(result.test3).to.contain("bla");
        expect(result.metricWidth).to.contain("13");
    });

    it("Extracts the parameters properly on single property", () => {
        let underTest: VisualizationLinkService = new VisualizationLinkService(new CityBuilderStore());
        let result: Parameters = underTest.getQueryParams("?test=123");

        expect(result.test).to.contain("123");
    });

    it("Should initiate visualization if all values are set", () => {
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let underTest: VisualizationLinkService = new VisualizationLinkService(testCityBuilderStore);

        let initialMetrics: Metric[] = [];
        let metricFootprint = new Metric("123", "INT", "siuhf");
        initialMetrics.push(metricFootprint);
        let metricHeight = new Metric("13", "INT", "siuhf2");
        initialMetrics.push(metricHeight);
        testCityBuilderStore.genericMetrics.addMetrics(initialMetrics);

        underTest.process("?metricFootprint=123&metricHeight=13&layout=district&scale=exponential&metricColor=coverage");

        expect(testCityBuilderStore.profile).to.be.eq(custom);
        expect(testCityBuilderStore.profile.footprint).to.be.eq(metricFootprint);
        expect(testCityBuilderStore.profile.height).to.be.eq(metricHeight);
        expect(testCityBuilderStore.metricColor).to.be.eq(coverageMetric);
        expect(testCityBuilderStore.layout).to.be.eq(district);
        expect(testCityBuilderStore.profile.scale).to.be.eq(EXPONENTIAL);

        expect(testCityBuilderStore.show).to.be.eq(false);
        expect(testCityBuilderStore.initiateBuildProcess).to.be.eq(true);
    });

    it("Should initiate visualization if all values are set - other settings", () => {
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let underTest: VisualizationLinkService = new VisualizationLinkService(testCityBuilderStore);

        let initialMetrics: Metric[] = [];
        let metricFootprint = new Metric("123", "INT", "siuhf");
        initialMetrics.push(metricFootprint);
        let metricHeight = new Metric("13", "INT", "siuhf2");
        initialMetrics.push(metricHeight);
        testCityBuilderStore.genericMetrics.addMetrics(initialMetrics);

        underTest.process("?metricFootprint=13&metricHeight=123&layout=evostreet&scale=linear_s&metricColor=package");

        expect(testCityBuilderStore.profile).to.be.eq(custom);
        expect(testCityBuilderStore.profile.footprint).to.be.eq(metricHeight);
        expect(testCityBuilderStore.profile.height).to.be.eq(metricFootprint);
        expect(testCityBuilderStore.metricColor).to.be.eq(packageNameMetric);
        expect(testCityBuilderStore.layout).to.be.eq(evostreet);
        expect(testCityBuilderStore.profile.scale).to.be.eq(LINEAR_SCALED);

        expect(testCityBuilderStore.show).to.be.eq(false);
        expect(testCityBuilderStore.initiateBuildProcess).to.be.eq(true);
    });

});
