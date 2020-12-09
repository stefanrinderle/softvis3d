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
import * as Sinon from "sinon";
import { Vector3 } from "three";
import { AppConfiguration } from "../../src/classes/AppConfiguration";
import VisualizationLinkParams from "../../src/classes/VisualizationLinkParams";
import VisualizationLinkSerializationService from "../../src/classes/VisualizationLinkSerializationService";
import VisualizationOptions from "../../src/classes/VisualizationOptions";
import UrlParameterService from "../../src/services/UrlParameterService";
import VisualizationLinkService from "../../src/services/VisualizationLinkService";
import CityBuilderStore from "../../src/stores/CityBuilderStore";
import SceneStore from "../../src/stores/SceneStore";
import { createMock, createMockInjection } from "../Helper";

describe("VisualizationLinkService", () => {
    it("Happy case - apply link params", () => {
        const testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        const testCityBuilderStore: CityBuilderStore = createMockInjection(new CityBuilderStore());
        createMockInjection(new SceneStore());
        const underTest: VisualizationLinkService = new VisualizationLinkService(
            testAppConfiguration
        );

        const localUrlParameterService = createMock(UrlParameterService);
        localUrlParameterService.getQueryParams.returns({
            visualizationStatus: "iuhsdfiuhsdifuhsidfu",
        });

        const localVisualizationLinkSerializationService = createMock(
            VisualizationLinkSerializationService
        );
        localVisualizationLinkSerializationService.deserialize.returns(
            new VisualizationLinkParams(VisualizationOptions.createDefault(), null, new Vector3())
        );

        const search = "sdfiuisduhfiuhsdiuhasiduhaiduhasiduhiuhdisauh";
        underTest.process(search);

        assert(localUrlParameterService.getQueryParams.calledWithExactly(search));

        expect(testCityBuilderStore.initiateBuildProcess).to.be.eq(true);
    });

    it("Does nothing on empty string", () => {
        const testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        const testCityBuilderStore: CityBuilderStore = createMockInjection(new CityBuilderStore());
        createMockInjection(new SceneStore());
        const underTest: VisualizationLinkService = new VisualizationLinkService(
            testAppConfiguration
        );

        const localUrlParameterService = createMock(UrlParameterService);
        localUrlParameterService.getQueryParams.returns({
            visualizationStatus: "",
        });

        const localVisualizationLinkSerializationService = createMock(
            VisualizationLinkSerializationService
        );
        localVisualizationLinkSerializationService.deserialize.returns(null);

        underTest.process("");

        assert(localUrlParameterService.getQueryParams.calledWithExactly(""));

        expect(testCityBuilderStore.initiateBuildProcess).to.be.eq(false);
    });

    it("Extracts the parameters properly", () => {
        const testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        createMockInjection(new CityBuilderStore());

        const localSceneStore: SceneStore = createMockInjection(new SceneStore());
        // Math.round in place
        localSceneStore.cameraPosition = new Vector3(1.2, 2.1, 3.3);

        const underTest: VisualizationLinkService = new VisualizationLinkService(
            testAppConfiguration
        );

        const localUrlParameterService = createMock(UrlParameterService);
        localUrlParameterService.createVisualizationLinkForCurrentUrl.returns("abc");

        const localVisualizationLinkSerializationService = createMock(
            VisualizationLinkSerializationService
        );
        const expectedParam = "sidufhisudhfisuhdfisuhdfiushdfiuhsdfiuh";
        localVisualizationLinkSerializationService.serialize.returns(expectedParam);

        const result = underTest.createVisualizationLink();

        assert(
            localUrlParameterService.createVisualizationLinkForCurrentUrl.calledWithExactly(
                document.location.href,
                {
                    visualizationStatus: expectedParam,
                }
            )
        );

        expect(result).to.contain("abc");
    });

    it("Should throw error if no camera position is set.", () => {
        const testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        createMockInjection(new CityBuilderStore());
        createMockInjection(new SceneStore());

        const underTest: VisualizationLinkService = new VisualizationLinkService(
            testAppConfiguration
        );

        expect(() => {
            underTest.createVisualizationLink();
        }).to.throw("sceneStore.cameraPosition is undefined or null on createVisualizationLink");
    });

    it("create plain visualization link", () => {
        const testAppConfiguration: any = Sinon.createStubInstance(AppConfiguration);
        const baseUrl = "/isudfisfuh";
        const projectKey = "siudhfg:suzdgs";
        testAppConfiguration.baseUrl = baseUrl;
        testAppConfiguration.projectKey = projectKey;

        createMockInjection(new CityBuilderStore());

        const localSceneStore: SceneStore = createMockInjection(new SceneStore());
        localSceneStore.cameraPosition = new Vector3(1, 2, 3);

        const expectedSelectedObjectId = "123453";
        localSceneStore.selectedObjectId = expectedSelectedObjectId;

        const underTest: VisualizationLinkService = new VisualizationLinkService(
            testAppConfiguration
        );

        const localUrlParameterService = createMock(UrlParameterService);
        localUrlParameterService.createVisualizationLinkForCurrentUrl.returns("abc");

        const localVisualizationLinkSerializationService = createMock(
            VisualizationLinkSerializationService
        );
        const expectedParam = "sidufhisudhfisuhdfisuhdfiushdfiuhsdfiuh";
        localVisualizationLinkSerializationService.serialize.returns(expectedParam);

        const result = underTest.createPlainVisualizationLink();

        const expectedresult =
            baseUrl +
            "/static/softvis3d/index.html" +
            "?projectKey=" +
            projectKey +
            "&baseUrl=" +
            baseUrl;
        assert(
            localUrlParameterService.createVisualizationLinkForCurrentUrl.calledWithExactly(
                expectedresult,
                {
                    visualizationStatus: expectedParam,
                }
            )
        );

        expect(result).to.contain("abc");
    });
});
