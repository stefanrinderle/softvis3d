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
import * as Sinon from "sinon";
import {Vector3} from "three";
import {AppConfiguration} from "../../src/classes/AppConfiguration";
import VisualizationLinkParams from "../../src/classes/VisualizationLinkParams";
import VisualizationLinkSerializationService from "../../src/classes/VisualizationLinkSerializationService";
import VisualizationOptions from "../../src/classes/VisualizationOptions";
import UrlParameterService from "../../src/services/UrlParameterService";
import VisualizationLinkService from "../../src/services/VisualizationLinkService";
import CityBuilderStore from "../../src/stores/CityBuilderStore";
import SceneStore from "../../src/stores/SceneStore";
import {createMock} from "../Helper";

describe("VisualizationLinkService", () => {

    it("Happy case - apply link params", () => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();
        let underTest: VisualizationLinkService =
            new VisualizationLinkService(testAppConfiguration);

        let localUrlParameterService = createMock(UrlParameterService);
        localUrlParameterService.getQueryParams.returns({
            visualizationStatus: "iuhsdfiuhsdifuhsidfu"
        });

        let localVisualizationLinkSerializationService = createMock(VisualizationLinkSerializationService);
        localVisualizationLinkSerializationService.deserialize.returns(
            new VisualizationLinkParams(VisualizationOptions.createDefault(), null, new Vector3())
        );

        const search = "sdfiuisduhfiuhsdiuhasiduhaiduhasiduhiuhdisauh";
        underTest.process(testCityBuilderStore, localSceneStore, search);

        assert(localUrlParameterService.getQueryParams.calledWithExactly(search));

        expect(testCityBuilderStore.initiateBuildProcess).to.be.eq(true);
    });

    it("Does nothing on empty string", () => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();
        let underTest: VisualizationLinkService =
            new VisualizationLinkService(testAppConfiguration);

        let localUrlParameterService = createMock(UrlParameterService);
        localUrlParameterService.getQueryParams.returns({
            visualizationStatus: ""
        });

        let localVisualizationLinkSerializationService = createMock(VisualizationLinkSerializationService);
        localVisualizationLinkSerializationService.deserialize.returns(null);

        underTest.process(testCityBuilderStore, localSceneStore, "");

        assert(localUrlParameterService.getQueryParams.calledWithExactly(""));

        expect(testCityBuilderStore.initiateBuildProcess).to.be.eq(false);
    });

    it("Extracts the parameters properly", () => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        let localCityBuilderStore = new CityBuilderStore();

        let localSceneStore: SceneStore = new SceneStore();
        // Math.round in place
        localSceneStore.cameraPosition = new Vector3(1.2, 2.1, 3.3);

        let underTest: VisualizationLinkService = new VisualizationLinkService(testAppConfiguration);

        let localUrlParameterService = createMock(UrlParameterService);
        localUrlParameterService.createVisualizationLinkForCurrentUrl.returns("abc");

        let localVisualizationLinkSerializationService = createMock(VisualizationLinkSerializationService);
        const expectedParam = "sidufhisudhfisuhdfisuhdfiushdfiuhsdfiuh";
        localVisualizationLinkSerializationService.serialize.returns(expectedParam);

        let result = underTest.createVisualizationLink(localCityBuilderStore, localSceneStore);

        assert(localUrlParameterService.createVisualizationLinkForCurrentUrl.calledWithExactly(document.location.href, {
            visualizationStatus: expectedParam
        }));

        expect(result).to.contain("abc");
    });

    it("Should throw error if no camera position is set.", () => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        let localCityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        let underTest: VisualizationLinkService = new VisualizationLinkService(testAppConfiguration);

        expect(() => {
            underTest.createVisualizationLink(localCityBuilderStore, localSceneStore);
        }).to.throw("sceneStore.cameraPosition is undefined or null on createVisualizationLink");
    });

    it("create plain visualization link", () => {
        let testAppConfiguration: any = Sinon.createStubInstance(AppConfiguration);
        let baseUrl = "/isudfisfuh";
        let projectKey = "siudhfg:suzdgs";
        testAppConfiguration.baseUrl = baseUrl;
        testAppConfiguration.projectKey = projectKey;

        let localCityBuilderStore = new CityBuilderStore();

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.cameraPosition = new Vector3(1, 2, 3);

        let expectedSelectedObjectId: string = "123453";
        localSceneStore.selectedObjectId = expectedSelectedObjectId;

        let underTest: VisualizationLinkService =
            new VisualizationLinkService(testAppConfiguration);

        let localUrlParameterService = createMock(UrlParameterService);
        localUrlParameterService.createVisualizationLinkForCurrentUrl.returns("abc");

        let localVisualizationLinkSerializationService = createMock(VisualizationLinkSerializationService);
        const expectedParam = "sidufhisudhfisuhdfisuhdfiushdfiuhsdfiuh";
        localVisualizationLinkSerializationService.serialize.returns(expectedParam);

        let result = underTest.createPlainVisualizationLink(localCityBuilderStore, localSceneStore);

        const expectedresult = baseUrl + "/static/softvis3d/index.html" +
            "?projectKey=" + projectKey + "&baseUrl=" + baseUrl;
        assert(localUrlParameterService.createVisualizationLinkForCurrentUrl.calledWithExactly(expectedresult, {
            visualizationStatus: expectedParam
        }));

        expect(result).to.contain("abc");
    });
});
