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
import {AppStatusStore} from "../../../../src/stores/AppStatusStore";
import * as Sinon from "sinon";
import {CityBuilderStore} from "../../../../src/stores/CityBuilderStore";
import {SceneStore} from "../../../../src/stores/SceneStore";
import VisualizationOptions from "../../../../src/classes/VisualizationOptions";
import SonarQubeMeasuresService from "../../../../src/services/sonarqube/measures/SonarQubeMeasuresService";
import SonarQubeMeasuresMetricService from "../../../../src/services/sonarqube/measures/SonarQubeMeasuresMetricService";
import SonarQubeMeasuresTreeService from "../../../../src/services/sonarqube/measures/SonarQubeMeasuresTreeService";
import {TreeElement} from "../../../../src/classes/TreeElement";

describe("SonarQubeMeasuresService", () => {

    it("should call backend to get visualization", (done) => {
        let clock = Sinon.useFakeTimers();

        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let testSceneStore: SceneStore = new SceneStore();
        testSceneStore.scmMetricLoaded = true;

        let measureTreeService: any = Sinon.createStubInstance(SonarQubeMeasuresTreeService);
        let measureMetricService: any = Sinon.createStubInstance(SonarQubeMeasuresMetricService);

        let spyLoad = Sinon.spy(testAppStatusStore, "load");
        let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        let projectKey: string = "sdufsofin";
        let underTest: SonarQubeMeasuresService =
            new SonarQubeMeasuresService(projectKey, measureTreeService, measureMetricService, testAppStatusStore,
                                         testCityBuilderStore, testSceneStore);

        let expectedData: TreeElement = new TreeElement(projectKey, projectKey, {}, projectKey, projectKey, false);
        measureTreeService.loadTree.returns(Promise.resolve(expectedData));

        underTest.loadMeasures(VisualizationOptions.createDefault());

        let returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            Sinon.assert.called(measureTreeService.loadTree);
            assert(spyLoad.calledWith(SonarQubeMeasuresService.LOAD_MEASURES));
            assert(spyLoadComplete.calledWith(SonarQubeMeasuresService.LOAD_MEASURES));

            expect(testSceneStore.scmMetricLoaded).to.be.eq(false);
            expect(testSceneStore.projectData).to.deep.equal(expectedData);
            clock.tick(10);
            done();
        }).catch((error) => done(error));
    });

    it("should NOT call backend with the same parameters", (done) => {
        let clock = Sinon.useFakeTimers();

        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let testSceneStore: SceneStore = new SceneStore();
        testSceneStore.scmMetricLoaded = true;

        let measureTreeService: any = Sinon.createStubInstance(SonarQubeMeasuresTreeService);
        let measureMetricService: any = Sinon.createStubInstance(SonarQubeMeasuresMetricService);

        let spyLoad = Sinon.spy(testAppStatusStore, "load");
        let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        measureMetricService.getMetricRequestValues.returns("isudgfis");

        let projectKey: string = "sdufsofin";
        let underTest: SonarQubeMeasuresService =
            new SonarQubeMeasuresService(projectKey, measureTreeService, measureMetricService, testAppStatusStore,
                                         testCityBuilderStore, testSceneStore);

        let expectedData: TreeElement = new TreeElement("", projectKey, {}, "", "", false);
        measureTreeService.loadTree.returns(Promise.resolve(expectedData));

        underTest.loadMeasures(VisualizationOptions.createDefault());

        let returnPromise: Promise<any> = Promise.resolve({});
        let returnPromise2: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            underTest.loadMeasures(VisualizationOptions.createDefault());

            clock.tick(10);
            returnPromise2.then(() => {
                Sinon.assert.calledOnce(measureTreeService.loadTree);
                assert(spyLoad.calledTwice);
                assert(spyLoadComplete.calledTwice);
                done();
            }).catch((error) => done(error));
        }).catch((error) => done(error));
    });

    it("should react on internal errors", (done) => {
        let clock = Sinon.useFakeTimers();

        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let testSceneStore: SceneStore = new SceneStore();
        testSceneStore.scmMetricLoaded = true;

        let measureTreeService: any = Sinon.createStubInstance(SonarQubeMeasuresTreeService);
        let measureMetricService: any = Sinon.createStubInstance(SonarQubeMeasuresMetricService);

        let spyLoad = Sinon.spy(testAppStatusStore, "load");
        let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");
        let spyError = Sinon.spy(testAppStatusStore, "error");

        let projectKey: string = "sdufsofin";
        let underTest: SonarQubeMeasuresService =
            new SonarQubeMeasuresService(projectKey, measureTreeService, measureMetricService, testAppStatusStore,
                                         testCityBuilderStore, testSceneStore);

        measureTreeService.loadTree.returns(Promise.reject({data: {message: "Error message"}}));

        underTest.loadMeasures(VisualizationOptions.createDefault());

        let returnPromise: Promise<any> = Promise.resolve({});
        let returnPromise2: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            returnPromise2.then(() => {
                clock.tick(10);
                assert(measureTreeService.loadTree.called);
                assert(spyLoad.calledWith(SonarQubeMeasuresService.LOAD_MEASURES));
                assert(spyLoadComplete.calledWith(SonarQubeMeasuresService.LOAD_MEASURES));
                assert(spyError.called);
                done();
            }).catch((error) => done(error));
        }).catch((error) => done(error));
    });

});
