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
import VisualizationOptionStore from "../../src/classes/VisualizationOptionStore";
import { complexityColorMetric } from "../../src/constants/Metrics";
import SceneReactions from "../../src/reactions/SceneReactions";
import CityLayoutService from "../../src/services/layout/CityLayoutService";
import CityBuilderStore from "../../src/stores/CityBuilderStore";
import SceneStore from "../../src/stores/SceneStore";
import { createDefaultDir } from "../classes/TreeElement.spec";
import { createMock, createMockInjection } from "../Helper";

describe("SceneReactions", () => {
    it("should change city builder color metric setting if changed in the scene", () => {
        createMockInjection(new SceneStore());
        createMockInjection(VisualizationOptionStore.createDefault());

        const testCityBuilderStore = createMockInjection(new CityBuilderStore());
        createMock(CityLayoutService);

        const reactions = new SceneReactions();

        testCityBuilderStore.options.metricColor = complexityColorMetric;

        expect(reactions).not.to.be.null;
        expect(testCityBuilderStore.options.metricColor).to.be.eq(complexityColorMetric);
    });

    it("should rebuild city if color metric changed", () => {
        createMockInjection(new SceneStore());
        const visualizationOptions = createMockInjection(VisualizationOptionStore.createDefault());

        const testCityBuilderStore: CityBuilderStore = createMockInjection(new CityBuilderStore());
        const testCityLayoutService = createMock(CityLayoutService);

        testCityBuilderStore.show = false;

        const reactions = new SceneReactions();

        visualizationOptions.metricColor = complexityColorMetric;

        assert(testCityLayoutService.createCity.calledOnce);
        expect(reactions).not.to.be.null;
    });

    it("should convert backend data to threeJS shapes", () => {
        const testSceneStore = createMockInjection(new SceneStore());
        createMockInjection(new CityBuilderStore());
        const testLegacyConnector = createMock(CityLayoutService);

        testSceneStore.options = VisualizationOptionStore.createDefault();

        const reactions = new SceneReactions();

        testSceneStore.projectData = createDefaultDir();

        assert(testLegacyConnector.createCity.calledOnce);
        expect(reactions).not.to.be.null;
    });
});
