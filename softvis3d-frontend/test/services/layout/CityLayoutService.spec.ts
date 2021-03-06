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
import VisualizationOptionStore from "../../../src/stores/VisualizationOptionStore";
import { numberOfAuthorsScmColorMetric } from "../../../src/constants/ColorMetrics";
import CityLayoutService from "../../../src/services/layout/CityLayoutService";
import LayoutProcessor from "../../../src/services/layout/LayoutProcessor";
import SonarQubeScmService from "../../../src/services/sonarqube/scm/SonarQubeScmService";
import AppStatusStore from "../../../src/stores/AppStatusStore";
import SceneStore from "../../../src/stores/SceneStore";
import { createDefaultDir } from "../../classes/TreeElement.spec";
import { createMock, createMockInjection } from "../../Helper";

describe("CityLayoutService", () => {
    it("should call layoutProcessor", (done) => {
        const clock = Sinon.useFakeTimers();

        createMockInjection(new AppStatusStore());
        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        createMockInjection(VisualizationOptionStore.createDefault());
        testSceneStore.projectData = createDefaultDir();

        createMock(SonarQubeScmService);
        const layoutProcessor = createMock(LayoutProcessor);

        const expectedShape = {};
        layoutProcessor.getIllustration.returns(
            Promise.resolve({
                shapes: expectedShape,
            })
        );

        const underTest: CityLayoutService = new CityLayoutService();

        underTest.createCity();

        const returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise
            .then(() => {
                assert(layoutProcessor.getIllustration.called);

                const returnPromise2: Promise<any> = Promise.resolve({});
                returnPromise2.then(() => {
                    expect(testSceneStore.shapes).to.be.deep.equal(expectedShape);
                    done();
                });
            })
            .catch((error) => done(error));
    });

    it("should send load status is app state", (done) => {
        const clock = Sinon.useFakeTimers();

        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());
        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        createMockInjection(VisualizationOptionStore.createDefault());
        testSceneStore.projectData = createDefaultDir();

        createMock(SonarQubeScmService);

        const spyLoad = Sinon.spy(testAppStatusStore, "load");
        const spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        const layoutProcessor = createMock(LayoutProcessor);
        layoutProcessor.getIllustration.resolves({
            shapes: {},
        });

        const underTest: CityLayoutService = new CityLayoutService();

        underTest.createCity();

        const returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise
            .then(() => {
                assert(spyLoad.calledWith(CityLayoutService.BUILD_CITY));
                clock.tick(10);

                const returnPromise2: Promise<any> = Promise.resolve({});
                returnPromise2.then(() => {
                    assert(spyLoadComplete.calledWith(CityLayoutService.BUILD_CITY));
                    done();
                });
            })
            .catch((error) => done(error));
    });

    it("should call measure service if numberOfAuthorsScmColorMetric", (done) => {
        const clock = Sinon.useFakeTimers();

        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());
        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        const visualizationOptions = createMockInjection(VisualizationOptionStore.createDefault());
        visualizationOptions.metricColor = numberOfAuthorsScmColorMetric;
        testSceneStore.projectData = createDefaultDir();

        const scmService = createMock(SonarQubeScmService);
        scmService.assertScmInfoAreLoaded.resolves({});

        const spyLoad = Sinon.spy(testAppStatusStore, "load");
        const spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        const underTest: CityLayoutService = new CityLayoutService();

        underTest.createCity();

        const returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise
            .then(() => {
                assert(spyLoad.calledWith(CityLayoutService.BUILD_CITY));
                assert(scmService.assertScmInfoAreLoaded.called);

                const returnPromise2: Promise<any> = Promise.resolve({});
                returnPromise2.then(() => {
                    assert(spyLoadComplete.calledWith(CityLayoutService.BUILD_CITY));
                    done();
                });
            })
            .catch((error) => done(error));
    });
});
