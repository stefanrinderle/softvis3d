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
import {assert, expect} from "chai";
import {Vector3} from "three";
import VisualizationLinkService from "../../src/services/VisualizationLinkService";
import {CityBuilderStore} from "../../src/stores/CityBuilderStore";
import Metric from "../../src/classes/Metric";
import {custom, defaultProfile} from "../../src/constants/Profiles";
import {district, evostreet} from "../../src/constants/Layouts";
import {EXPONENTIAL, LINEAR_SCALED} from "../../src/constants/Scales";
import {coverageColorMetric, packageNameColorMetric} from "../../src/constants/Metrics";
import {SceneStore} from "../../src/stores/SceneStore";
import * as Sinon from "sinon";
import UrlParameterService from "../../src/services/UrlParameterService";
import {AppConfiguration} from "../../src/classes/AppConfiguration";

describe("VisualizationLinkService", () => {

    it("Does nothing on empty string", () => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();
        let underTest: VisualizationLinkService =
            new VisualizationLinkService(testAppConfiguration, testCityBuilderStore, localSceneStore);

        let stub = Sinon.stub(UrlParameterService, "getQueryParams").returns({});

        underTest.process("");

        assert(stub.calledWithExactly(""));

        expect(testCityBuilderStore.initiateBuildProcess).to.be.eq(false);

        stub.restore();
    });

    it("Should initiate visualization if all values are set", () => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();
        let underTest: VisualizationLinkService =
            new VisualizationLinkService(testAppConfiguration, testCityBuilderStore, localSceneStore);

        let initialMetrics: Metric[] = [];
        let metricFootprint = new Metric("123", "siuhf", "");
        initialMetrics.push(metricFootprint);
        let metricHeight = new Metric("13", "siuhf2", "");
        initialMetrics.push(metricHeight);
        testCityBuilderStore.genericMetrics.addMetrics(initialMetrics);

        let expectedSelectedObjectId: string = "123453";

        let stub = Sinon.stub(UrlParameterService, "getQueryParams").returns({
            metricFootprint: "123",
            metricHeight: "13",
            layout: "district",
            scale: "exponential",
            metricColor: "coverage",
            selectedObjectId: expectedSelectedObjectId,
            cameraX: "1",
            cameraY: "2",
            cameraZ: "3"
        });

        // input for the method comes from UrlParameterService
        underTest.process("abc");

        assert(stub.calledWithExactly("abc"));

        expect(testCityBuilderStore.profile).to.be.eq(custom);
        expect(testCityBuilderStore.profile.footprintMetricId).to.be.eq(metricFootprint.id);
        expect(testCityBuilderStore.profile.heightMetricId).to.be.eq(metricHeight.id);
        expect(testCityBuilderStore.metricColor).to.be.eq(coverageColorMetric);
        expect(testCityBuilderStore.layout).to.be.eq(district);
        expect(testCityBuilderStore.profile.scale).to.be.eq(EXPONENTIAL);

        expect(localSceneStore.cameraPosition).to.be.not.null;
        expect(localSceneStore.cameraPosition).to.be.not.undefined;
        if (localSceneStore.cameraPosition) {
            expect(localSceneStore.cameraPosition.x).to.be.eq(1);
            expect(localSceneStore.cameraPosition.y).to.be.eq(2);
            expect(localSceneStore.cameraPosition.z).to.be.eq(3);
        }
        expect(localSceneStore.selectedObjectId).to.be.eq(expectedSelectedObjectId);

        expect(testCityBuilderStore.show).to.be.eq(false);
        expect(testCityBuilderStore.initiateBuildProcess).to.be.eq(true);

        stub.restore();
    });

    it("Should initiate visualization if all values are set - other settings", () => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();
        let underTest: VisualizationLinkService =
            new VisualizationLinkService(testAppConfiguration, testCityBuilderStore, localSceneStore);

        let initialMetrics: Metric[] = [];
        let metricFootprint = new Metric("123", "siuhf", "");
        initialMetrics.push(metricFootprint);
        let metricHeight = new Metric("13", "siuhf2", "");
        initialMetrics.push(metricHeight);
        testCityBuilderStore.genericMetrics.addMetrics(initialMetrics);

        let stub = Sinon.stub(UrlParameterService, "getQueryParams").returns({
            metricFootprint: "13",
            metricHeight: "123",
            layout: "evostreet",
            scale: "linear_s",
            metricColor: "package",
            cameraX: "999",
            cameraY: "88.11",
            cameraZ: "333333.3300"
        });

        // input for the method comes from UrlParameterService
        underTest.process("abc");

        assert(stub.calledWithExactly("abc"));

        expect(testCityBuilderStore.profile).to.be.eq(custom);
        expect(testCityBuilderStore.profile.footprintMetricId).to.be.eq(metricHeight.id);
        expect(testCityBuilderStore.profile.heightMetricId).to.be.eq(metricFootprint.id);
        expect(testCityBuilderStore.metricColor).to.be.eq(packageNameColorMetric);
        expect(testCityBuilderStore.layout).to.be.eq(evostreet);
        expect(testCityBuilderStore.profile.scale).to.be.eq(LINEAR_SCALED);

        expect(localSceneStore.cameraPosition).to.be.not.null;
        expect(localSceneStore.cameraPosition).to.be.not.undefined;
        if (localSceneStore.cameraPosition) {
            expect(localSceneStore.cameraPosition.x).to.be.approximately(999, 1);
            expect(localSceneStore.cameraPosition.y).to.be.approximately(88, 1);
            expect(localSceneStore.cameraPosition.z).to.be.approximately(333333, 1);
        }

        expect(testCityBuilderStore.show).to.be.eq(false);
        expect(testCityBuilderStore.initiateBuildProcess).to.be.eq(true);

        stub.restore();
    });

    it("Extracts the parameters properly for mandatory params", () => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        let localCityBuilderStore = new CityBuilderStore();
        localCityBuilderStore.profile = defaultProfile;

        let localSceneStore: SceneStore = new SceneStore();
        // Math.round in place
        localSceneStore.cameraPosition = new Vector3(1.2, 2.1, 3.3);

        let underTest: VisualizationLinkService =
            new VisualizationLinkService(testAppConfiguration, localCityBuilderStore, localSceneStore);

        let stub = Sinon.stub(UrlParameterService, "createVisualizationLinkForCurrentUrl").returns("abc");

        let result = underTest.createVisualizationLink();

        assert(stub.calledWithExactly(document.location.href, {
            metricFootprint: "complexity",
            metricHeight: "ncloc",
            metricColor: "none",
            layout: "evostreet",
            scale: "logarithmic",
            cameraX: "1",
            cameraY: "2",
            cameraZ: "3",
            colorTheme: "default"
        }));

        expect(result).to.contain("abc");

        stub.restore();
    });

    it("Extracts the parameters properly with all optional params", () => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);

        let localCityBuilderStore = new CityBuilderStore();
        localCityBuilderStore.profile = defaultProfile;

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.cameraPosition = new Vector3(1, 2, 3);

        let expectedSelectedObjectId: string = "123453";
        localSceneStore.selectedObjectId = expectedSelectedObjectId;

        let underTest: VisualizationLinkService =
            new VisualizationLinkService(testAppConfiguration, localCityBuilderStore, localSceneStore);

        let stub = Sinon.stub(UrlParameterService, "createVisualizationLinkForCurrentUrl").returns("abc");

        let result = underTest.createVisualizationLink();

        assert(stub.calledWithExactly(document.location.href, {
            metricFootprint: "complexity",
            metricHeight: "ncloc",
            metricColor: "none",
            layout: "evostreet",
            scale: "logarithmic",
            cameraX: "1",
            cameraY: "2",
            cameraZ: "3",
            colorTheme: "default",
            selectedObjectId: expectedSelectedObjectId
        }));

        expect(result).to.contain("abc");

        stub.restore();
    });

    it("Should throw error if no camera position is set.", () => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        let localCityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        let underTest: VisualizationLinkService =
            new VisualizationLinkService(testAppConfiguration, localCityBuilderStore, localSceneStore);

        expect(() => {
            underTest.createVisualizationLink();
        }).to.throw("this.sceneStore.cameraPosition is undefined or null on createVisualizationLink");
    });

    it("create plain visualization link", () => {
        let testAppConfiguration: any = Sinon.createStubInstance(AppConfiguration);
        let baseUrl = "/isudfisfuh";
        let projectKey = "siudhfg:suzdgs";
        testAppConfiguration.baseUrl = baseUrl;
        testAppConfiguration.projectKey = projectKey;

        let localCityBuilderStore = new CityBuilderStore();
        localCityBuilderStore.profile = defaultProfile;

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.cameraPosition = new Vector3(1, 2, 3);

        let expectedSelectedObjectId: string = "123453";
        localSceneStore.selectedObjectId = expectedSelectedObjectId;

        let underTest: VisualizationLinkService =
            new VisualizationLinkService(testAppConfiguration, localCityBuilderStore, localSceneStore);

        let stub = Sinon.stub(UrlParameterService, "createVisualizationLinkForCurrentUrl").returns("abc");

        let result = underTest.createPlainVisualizationLink();

        const expectedresult = baseUrl + "/static/softvis3d/index.html" +
            "?projectKey=" + projectKey + "&baseUrl=" + baseUrl;
        assert(stub.calledWithExactly(expectedresult, {
            metricFootprint: "complexity",
            metricHeight: "ncloc",
            metricColor: "none",
            layout: "evostreet",
            scale: "logarithmic",
            cameraX: "1",
            cameraY: "2",
            cameraZ: "3",
            colorTheme: "default",
            selectedObjectId: expectedSelectedObjectId
        }));

        expect(result).to.contain("abc");

        stub.restore();
    });
});
