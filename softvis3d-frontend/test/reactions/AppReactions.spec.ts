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
import AppReactions from "../../src/reactions/AppReactions";
import AutoReloadService from "../../src/services/AutoReloadService";
import SonarQubeMeasuresService from "../../src/services/sonarqube/measures/SonarQubeMeasuresService";
import AppStatusStore from "../../src/stores/AppStatusStore";
import CityBuilderStore from "../../src/stores/CityBuilderStore";
import SceneStore from "../../src/stores/SceneStore";
import {createMock} from "../Helper";

describe("AppReactions", () => {

    it("should auto reload on analysisDate change", () => {
        let testCityBuilderStore = new CityBuilderStore();
        let testAppStatusStore = new AppStatusStore();
        let testSceneStore = new SceneStore();
        const testSonarMeasuresService = createMock(SonarQubeMeasuresService);
        const testAutoReloadService = createMock(AutoReloadService);
        testAutoReloadService.isActive.returns(true);

        const reaction =
            new AppReactions(testAppStatusStore, testCityBuilderStore, testSceneStore);

        expect(testSonarMeasuresService.loadMeasures.notCalled).to.be.true;

        testAppStatusStore.analysisDate = new Date();

        expect(reaction).not.to.be.null;
        expect(testSonarMeasuresService.loadMeasures.calledOnce).to.be.true;
    });

    it("should not auto reload on analysisDate change but auto reload service not active", () => {
        let testCityBuilderStore = new CityBuilderStore();
        let testAppStatusStore = new AppStatusStore();
        let testSceneStore = new SceneStore();

        const testSonarMeasuresService = createMock(SonarQubeMeasuresService);
        const testAutoReloadService = createMock(AutoReloadService);
        testAutoReloadService.isActive.returns(false);

        const reaction =
            new AppReactions(testAppStatusStore, testCityBuilderStore, testSceneStore);

        expect(testSonarMeasuresService.loadMeasures.notCalled).to.be.true;

        testAppStatusStore.analysisDate = new Date();

        expect(reaction).not.to.be.null;
        expect(testSonarMeasuresService.loadMeasures.notCalled).to.be.true;
    });

});