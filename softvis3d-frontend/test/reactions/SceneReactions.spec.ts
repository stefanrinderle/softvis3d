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
import * as Sinon from "sinon";
import {SceneStore} from "../../src/stores/SceneStore";
import {CityBuilderStore} from "../../src/stores/CityBuilderStore";
import SceneReactions from "../../src/reactions/SceneReactions";
import {AppStatusStore} from "../../src/stores/AppStatusStore";
import LegacyCityCreator from "../../src/legacy/LegacyCityCreator";
import {complexityColorMetric} from "../../src/constants/Metrics";
import SonarQubeScmService from "../../src/services/sonarqube/SonarQubeScmService";

describe("SceneReactions", () => {

    it("should change city builder color metric setting if changed in the scene", () => {
        let testCityBuilderStore = new CityBuilderStore();
        let testSceneStore = new SceneStore();
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testSonarScmService: SonarQubeScmService =
            new SonarQubeScmService("", testAppStatusStore, testSceneStore);
        let testLegayConnector: LegacyCityCreator =
            new LegacyCityCreator(testSceneStore, testAppStatusStore, testSonarScmService);

        let reactions = new SceneReactions(testSceneStore, testCityBuilderStore, testLegayConnector);

        testSceneStore.options.metricColor = complexityColorMetric;

        expect(reactions).not.to.be.null;
        expect(testCityBuilderStore.metricColor).to.be.eq(complexityColorMetric);
    });

    it("should rebuild city if color metric changed", () => {
        let testCityBuilderStore = new CityBuilderStore();
        let testSceneStore = new SceneStore();
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testSonarScmService: SonarQubeScmService =
            new SonarQubeScmService("", testAppStatusStore, testSceneStore);
        let testLegayConnector: LegacyCityCreator =
            new LegacyCityCreator(testSceneStore, testAppStatusStore, testSonarScmService);

        let mockBuild = Sinon.mock(testLegayConnector);
        mockBuild.expects("createCity").once();

        let reactions = new SceneReactions(testSceneStore, testCityBuilderStore, testLegayConnector);

        testSceneStore.shapes = [];
        testSceneStore.options.metricColor = complexityColorMetric;

        mockBuild.verify();
        expect(reactions).not.to.be.null;
    });

    it("should convert backend data to threeJS shapes", () => {
        let testCityBuilderStore = new CityBuilderStore();
        let testSceneStore = new SceneStore();
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testSonarScmService: SonarQubeScmService =
            new SonarQubeScmService("", testAppStatusStore, testSceneStore);
        let testLegayConnector: LegacyCityCreator =
            new LegacyCityCreator(testSceneStore, testAppStatusStore, testSonarScmService);

        let mockBuild = Sinon.mock(testLegayConnector);
        mockBuild.expects("createCity").once();

        let reactions = new SceneReactions(testSceneStore, testCityBuilderStore, testLegayConnector);

        testSceneStore.legacyData = {
            id: "",
            name: "",
            isNode: false,
            children: [],
            measures: {},
            parentId: null
        };

        mockBuild.verify();

        expect(reactions).not.to.be.null;
    });

});