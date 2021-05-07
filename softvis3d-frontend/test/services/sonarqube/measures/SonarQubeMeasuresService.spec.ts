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
import { TreeElement } from "../../../../src/classes/TreeElement";
import SonarQubeMeasuresTreeService from "../../../../src/services/sonarqube/measures/api/SonarQubeMeasuresTreeService";
import SonarQubeMeasuresMetricService from "../../../../src/services/sonarqube/measures/SonarQubeMeasuresMetricService";
import SonarQubeMeasuresService from "../../../../src/services/sonarqube/measures/SonarQubeMeasuresService";
import SonarQubeFilterStructureService from "../../../../src/services/sonarqube/measures/structure/SonarQubeFilterStructureService";
import SonarQubeOptimizeStructureService from "../../../../src/services/sonarqube/measures/structure/SonarQubeOptimizeStructureService";
import AppStatusStore from "../../../../src/stores/AppStatusStore";
import CityBuilderStore from "../../../../src/stores/CityBuilderStore";
import SceneStore from "../../../../src/stores/SceneStore";
import { createDefaultDirWithKey } from "../../../classes/TreeElement.spec";
import { createMock, createMockInjection } from "../../../Helper";
import { createDefaultTestComponentStatusStore } from "../../../stores/ComponentStatusStore.spec";

describe("SonarQubeMeasuresService", () => {
    it("should call backend to get visualization", (done) => {
        const clock = Sinon.useFakeTimers();

        const componentStatusStore = createMockInjection(createDefaultTestComponentStatusStore());

        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());
        createMockInjection(new CityBuilderStore());
        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        testSceneStore.scmMetricLoaded = true;

        const measureTreeService = createMock(SonarQubeMeasuresTreeService);
        createMock(SonarQubeMeasuresMetricService);
        createMock(SonarQubeOptimizeStructureService);
        createMock(SonarQubeFilterStructureService);

        const spyLoad = Sinon.spy(testAppStatusStore, "load");
        const spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        const projectKey = componentStatusStore.appConfiguration.projectKey;
        const underTest: SonarQubeMeasuresService = new SonarQubeMeasuresService();

        const expectedData: TreeElement = createDefaultDirWithKey(projectKey, projectKey);
        measureTreeService.loadTree.resolves(expectedData);

        underTest.loadMeasures();

        const returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise
            .then(() => {
                Sinon.assert.called(measureTreeService.loadTree);
                assert(spyLoad.calledWith(SonarQubeMeasuresService.LOAD_MEASURES));
                assert(spyLoadComplete.calledWith(SonarQubeMeasuresService.LOAD_MEASURES));

                expect(testSceneStore.scmMetricLoaded).to.be.eq(false);
                expect(testSceneStore.projectData?.key).to.equal(expectedData.key);
                clock.tick(10);
                done();
            })
            .catch((error) => done(error));
    });

    it("should NOT call backend with the same parameters", (done) => {
        const clock = Sinon.useFakeTimers();

        const componentStatusStore = createMockInjection(createDefaultTestComponentStatusStore());
        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());
        createMockInjection(new CityBuilderStore());
        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        testSceneStore.scmMetricLoaded = true;

        const measureTreeService = createMock(SonarQubeMeasuresTreeService);
        const measureMetricService = createMock(SonarQubeMeasuresMetricService);
        createMock(SonarQubeFilterStructureService);
        createMock(SonarQubeOptimizeStructureService);

        const spyLoad = Sinon.spy(testAppStatusStore, "load");
        const spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        measureMetricService.getMetricRequestValues.returns("isudgfis");

        const projectKey = componentStatusStore.appConfiguration.projectKey;
        const underTest: SonarQubeMeasuresService = new SonarQubeMeasuresService();

        const expectedData: TreeElement = createDefaultDirWithKey(projectKey, projectKey);
        measureTreeService.loadTree.resolves(expectedData);

        underTest.loadMeasures();

        const returnPromise: Promise<any> = Promise.resolve({});
        const returnPromise2: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise
            .then(() => {
                underTest.loadMeasures();

                clock.tick(10);
                returnPromise2
                    .then(() => {
                        Sinon.assert.calledOnce(measureTreeService.loadTree);
                        assert(spyLoad.calledTwice);
                        assert(spyLoadComplete.calledTwice);
                        done();
                    })
                    .catch((error) => done(error));
            })
            .catch((error) => done(error));
    });

    it("should react on internal errors", (done) => {
        const clock = Sinon.useFakeTimers();

        createMockInjection(createDefaultTestComponentStatusStore());
        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());
        createMockInjection(new CityBuilderStore());
        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        testSceneStore.scmMetricLoaded = true;

        const measureTreeService = createMock(SonarQubeMeasuresTreeService);
        createMock(SonarQubeMeasuresMetricService);
        createMock(SonarQubeOptimizeStructureService);

        const spyLoad = Sinon.spy(testAppStatusStore, "load");
        const spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");
        const spyError = Sinon.spy(testAppStatusStore, "error");

        const underTest: SonarQubeMeasuresService = new SonarQubeMeasuresService();

        measureTreeService.loadTree.returns(Promise.reject({ data: { message: "Error message" } }));

        underTest.loadMeasures();

        const returnPromise: Promise<any> = Promise.resolve({});
        const returnPromise2: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise
            .then(() => {
                returnPromise2
                    .then(() => {
                        clock.tick(10);
                        assert(measureTreeService.loadTree.called);
                        assert(spyLoad.calledWith(SonarQubeMeasuresService.LOAD_MEASURES));
                        assert(spyLoadComplete.calledWith(SonarQubeMeasuresService.LOAD_MEASURES));
                        assert(spyError.called);
                        done();
                    })
                    .catch((error) => done(error));
            })
            .catch((error) => done(error));
    });
});
