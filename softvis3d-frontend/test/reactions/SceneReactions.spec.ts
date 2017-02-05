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
import {expect, assert} from "chai";
import * as Sinon from "sinon";
import {SceneStore} from "../../src/stores/SceneStore";
import {CityBuilderStore} from "../../src/stores/CityBuilderStore";
import SceneReactions from "../../src/reactions/SceneReactions";
import {AppStatusStore} from "../../src/stores/AppStatusStore";
import LegacyConnector from "../../src/legacy/LegacyConnector";
import SonarQubeLegacyService from "../../src/services/sonarqube/SonarQubeLegacyService";
import {complexityMetric} from "../../src/constants/Metrics";

describe("SceneReactions", () => {

    it("should change city builder color metric setting if changed in the scene", () => {
        let testCityBuilderStore = new CityBuilderStore();
        let testSceneStore = new SceneStore();
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testLegayConnector: LegacyConnector =
            new LegacyConnector(testSceneStore, testCityBuilderStore, testAppStatusStore);
        let testSonarService: SonarQubeLegacyService =
            new SonarQubeLegacyService("", "", testAppStatusStore, testCityBuilderStore, testSceneStore);

        new SceneReactions(testSceneStore, testCityBuilderStore, testAppStatusStore, testLegayConnector, testSonarService);

        testSceneStore.options.metricColor = complexityMetric;

        expect(testCityBuilderStore.metricColor).to.be.eq(complexityMetric);
    });

    it("should load backend legacy data when the scene should be rendered", () => {
        let testCityBuilderStore = new CityBuilderStore();
        let testSceneStore = new SceneStore();
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testLegayConnector: LegacyConnector =
            new LegacyConnector(testSceneStore, testCityBuilderStore, testAppStatusStore);
        let testSonarService: SonarQubeLegacyService =
            new SonarQubeLegacyService("", "", testAppStatusStore, testCityBuilderStore, testSceneStore);

        let spyLoad = Sinon.spy(testSonarService, "loadLegacyBackend");

        new SceneReactions(testSceneStore, testCityBuilderStore, testAppStatusStore, testLegayConnector, testSonarService);

        testSceneStore.refreshScene = true;

        assert(spyLoad.called);
    });

    it("should NOT load backend legacy data when the scene should NOT be rendered", () => {
        let testCityBuilderStore = new CityBuilderStore();
        let testSceneStore = new SceneStore();
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testLegayConnector: LegacyConnector =
            new LegacyConnector(testSceneStore, testCityBuilderStore, testAppStatusStore);
        let testSonarService: SonarQubeLegacyService =
            new SonarQubeLegacyService("", "", testAppStatusStore, testCityBuilderStore, testSceneStore);

        let spyLoad = Sinon.spy(testSonarService, "loadLegacyBackend");

        new SceneReactions(testSceneStore, testCityBuilderStore, testAppStatusStore, testLegayConnector, testSonarService);

        testSceneStore.refreshScene = false;

        assert(spyLoad.notCalled);
    });

    it("should rebuild city if color metric changed", () => {
        let testCityBuilderStore = new CityBuilderStore();
        let testSceneStore = new SceneStore();
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testLegayConnector: LegacyConnector =
            new LegacyConnector(testSceneStore, testCityBuilderStore, testAppStatusStore);
        let testSonarService: SonarQubeLegacyService =
            new SonarQubeLegacyService("", "", testAppStatusStore, testCityBuilderStore, testSceneStore);

        let spyBuild = Sinon.spy(testLegayConnector, "buildCity");

        new SceneReactions(testSceneStore, testCityBuilderStore, testAppStatusStore, testLegayConnector, testSonarService);

        testSceneStore.shapes = [];
        testSceneStore.options.metricColor = complexityMetric;

        assert(spyBuild.called);
    });

    it("should convert backend data to threeJS shapes", () => {
        let testCityBuilderStore = new CityBuilderStore();
        let testSceneStore = new SceneStore();
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testLegayConnector: LegacyConnector =
            new LegacyConnector(testSceneStore, testCityBuilderStore, testAppStatusStore);
        let testSonarService: SonarQubeLegacyService =
            new SonarQubeLegacyService("", "", testAppStatusStore, testCityBuilderStore, testSceneStore);

        let spyBuild = Sinon.spy(testLegayConnector, "buildCity");

        new SceneReactions(testSceneStore, testCityBuilderStore, testAppStatusStore, testLegayConnector, testSonarService);

        testSceneStore.legacyData = {
            id: "",
            name: "",
            isNode: false,
            children: [],
            measures: {},
            parentId: null
        };

        assert(spyBuild.called);
    });

});