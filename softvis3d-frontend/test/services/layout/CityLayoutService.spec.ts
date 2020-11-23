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
import {TreeElement} from "../../../src/classes/TreeElement";
import VisualizationOptions from "../../../src/classes/VisualizationOptions";
import {numberOfAuthorsBlameColorMetric} from "../../../src/constants/Metrics";
import CityLayoutService from "../../../src/services/layout/CityLayoutService";
import LayoutProcessor from "../../../src/services/layout/LayoutProcessor";
import SonarQubeScmService from "../../../src/services/sonarqube/SonarQubeScmService";
import AppStatusStore from "../../../src/stores/AppStatusStore";
import CityBuilderStore from "../../../src/stores/CityBuilderStore";
import SceneStore from "../../../src/stores/SceneStore";
import {createMock} from "../../Helper";

describe("CityLayoutService", () => {

    it("should call layoutProcessor", (done) => {
        let clock = Sinon.useFakeTimers();

        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testSceneStore: SceneStore = new SceneStore();
        let cityBuilderStore = new CityBuilderStore();
        testSceneStore.projectData = new TreeElement("", "", {}, "", "", false);

        createMock(SonarQubeScmService);
        let layoutProcessor = createMock(LayoutProcessor);

        let expectedShape = {};
        layoutProcessor.getIllustration.returns(Promise.resolve({
            shapes: expectedShape
        }));

        let underTest: CityLayoutService = new CityLayoutService();

        underTest.createCity(testSceneStore, testAppStatusStore, cityBuilderStore);

        let returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            assert(layoutProcessor.getIllustration.called);

            let returnPromise2: Promise<any> = Promise.resolve({});
            returnPromise2.then(() => {
                expect(testSceneStore.shapes).to.be.deep.equal(expectedShape);
                done();
            });
        }).catch((error) => done(error));
    });

    it("should send load status is app state", (done) => {
        let clock = Sinon.useFakeTimers();

        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testSceneStore: SceneStore = new SceneStore();
        let cityBuilderStore = new CityBuilderStore();
        testSceneStore.projectData = new TreeElement("", "", {}, "", "", false);

        createMock(SonarQubeScmService);

        let spyLoad = Sinon.spy(testAppStatusStore, "load");
        let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        let layoutProcessor = createMock(LayoutProcessor);
        layoutProcessor.getIllustration.returns(Promise.resolve({
            shapes: {}
        }));

        let underTest: CityLayoutService = new CityLayoutService();

        underTest.createCity(testSceneStore, testAppStatusStore, cityBuilderStore);

        let returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            assert(spyLoad.calledWith(CityLayoutService.BUILD_CITY));
            clock.tick(10);

            let returnPromise2: Promise<any> = Promise.resolve({});
            returnPromise2.then(() => {
                assert(spyLoadComplete.calledWith(CityLayoutService.BUILD_CITY));
                done();
            });
        }).catch((error) => done(error));
    });

    it("should call measure service if numberOfAuthorsBlameColorMetric", (done) => {
        let clock = Sinon.useFakeTimers();

        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testSceneStore: SceneStore = new SceneStore();
        let cityBuilderStore = new CityBuilderStore();
        testSceneStore.projectData = new TreeElement("", "", {}, "", "", false);
        cityBuilderStore.options = VisualizationOptions.createDefault();
        cityBuilderStore.options.metricColor = numberOfAuthorsBlameColorMetric;

        let scmService = createMock(SonarQubeScmService);
        scmService.assertScmInfoAreLoaded.callsFake(() => {
            return Promise.resolve({});
        });

        let spyLoad = Sinon.spy(testAppStatusStore, "load");
        let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        let underTest: CityLayoutService = new CityLayoutService();

        underTest.createCity(testSceneStore, testAppStatusStore, cityBuilderStore);

        let returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            assert(spyLoad.calledWith(CityLayoutService.BUILD_CITY));
            assert(scmService.assertScmInfoAreLoaded.called);

            let returnPromise2: Promise<any> = Promise.resolve({});
            returnPromise2.then(() => {
                assert(spyLoadComplete.calledWith(CityLayoutService.BUILD_CITY));
                done();
            });
        }).catch((error) => done(error));
    });
});
