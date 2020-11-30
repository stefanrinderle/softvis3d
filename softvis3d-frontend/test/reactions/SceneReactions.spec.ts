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
import VisualizationOptions from "../../src/classes/VisualizationOptions";
import {complexityColorMetric} from "../../src/constants/Metrics";
import SceneReactions from "../../src/reactions/SceneReactions";
import CityLayoutService from "../../src/services/layout/CityLayoutService";
import AppStatusStore from "../../src/stores/AppStatusStore";
import CityBuilderStore from "../../src/stores/CityBuilderStore";
import SceneStore from "../../src/stores/SceneStore";
import {createDefaultDir} from "../classes/TreeElement.spec";
import {createMock} from "../Helper";

describe("SceneReactions", () => {

    it("should change city builder color metric setting if changed in the scene", () => {
        let testSceneStore = Sinon.createStubInstance(SceneStore);
        let testCityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let appStatusStore =  Sinon.createStubInstance(AppStatusStore);
        createMock(CityLayoutService);

        testCityBuilderStore.options = VisualizationOptions.createDefault();

        let reactions = new SceneReactions(testSceneStore, testCityBuilderStore, appStatusStore);

        testCityBuilderStore.options.metricColor = complexityColorMetric;

        expect(reactions).not.to.be.null;
        expect(testCityBuilderStore.options.metricColor).to.be.eq(complexityColorMetric);
    });

    it("should rebuild city if color metric changed", () => {
        let testSceneStore = Sinon.createStubInstance(SceneStore);
        let testCityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let testCityLayoutService = createMock(CityLayoutService);
        let appStatusStore =  Sinon.createStubInstance(AppStatusStore);

        testCityBuilderStore.options = VisualizationOptions.createDefault();

        let reactions = new SceneReactions(testSceneStore, testCityBuilderStore, appStatusStore);

        testCityBuilderStore.shapes = [];
        testCityBuilderStore.options.metricColor = complexityColorMetric;

        assert(testCityLayoutService.createCity.calledOnce);
        expect(reactions).not.to.be.null;
    });

    it("should convert backend data to threeJS shapes", () => {
        let testSceneStore = Sinon.createStubInstance(SceneStore);
        let testCityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let testLegacyConnector = createMock(CityLayoutService);
        let appStatusStore =  Sinon.createStubInstance(AppStatusStore);

        testSceneStore.options = VisualizationOptions.createDefault();

        let reactions = new SceneReactions(testSceneStore, testCityBuilderStore, appStatusStore);

        testSceneStore.projectData = createDefaultDir();

        assert(testLegacyConnector.createCity.calledOnce);
        expect(reactions).not.to.be.null;
    });

});