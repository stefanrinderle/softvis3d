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

import { assert } from "chai";
import SonarQubeMetricsService, {
    SonarQubeApiMetric,
} from "../../../src/services/sonarqube/SonarQubeMetricsService";
import AppStatusStore from "../../../src/stores/AppStatusStore";
import * as Sinon from "sinon";
import CityBuilderStore from "../../../src/stores/CityBuilderStore";
import { MetricType } from "../../../src/classes/MetricType";
import { createMockInjection } from "../../Helper";

describe("SonarQubeMetricsService", () => {
    const linesOfCode = "lines of code";
    it("should call backend and add metric", (done) => {
        createMockInjection(new AppStatusStore());
        const testCityBuilderStore: CityBuilderStore = createMockInjection(new CityBuilderStore());
        const spyAdd = Sinon.spy(testCityBuilderStore.genericMetrics, "addMetrics");

        const apiUrl = "urlsihshoif";
        const underTest: SonarQubeMetricsService = new SonarQubeMetricsService(apiUrl);

        const expectedMetrics: SonarQubeApiMetric[] = [];
        expectedMetrics.push({
            id: 123,
            key: "ncloc",
            type: MetricType.INT,
            name: linesOfCode,
            description: "",
        });

        Sinon.stub(underTest, "callApi").resolves({
            data: {
                metrics: expectedMetrics,
            },
        });

        underTest
            .loadAvailableMetrics()
            .then(() => {
                Sinon.assert.called(spyAdd);
                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });

    it("should filter hidden metrics", (done) => {
        createMockInjection(new AppStatusStore());
        const testCityBuilderStore: CityBuilderStore = createMockInjection(new CityBuilderStore());
        const spyAdd = Sinon.spy(testCityBuilderStore.genericMetrics, "addMetrics");

        const apiUrl = "urlsihshoif";
        const underTest: SonarQubeMetricsService = new SonarQubeMetricsService(apiUrl);

        const expectedMetrics: SonarQubeApiMetric[] = [];
        expectedMetrics.push({
            id: 123,
            key: "ncloc",
            type: MetricType.INT,
            name: linesOfCode,
            hidden: false,
            description: "",
        });

        // eslint-disable-next-line sonarjs/no-identical-functions
        Sinon.stub(underTest, "callApi").resolves({
            data: {
                metrics: expectedMetrics,
            },
        });

        underTest
            .loadAvailableMetrics()
            .then(() => {
                Sinon.assert.calledWith(spyAdd, []);
                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });

    it("should filter string metrics", (done) => {
        createMockInjection(new AppStatusStore());
        const testCityBuilderStore: CityBuilderStore = createMockInjection(new CityBuilderStore());
        const spyAdd = Sinon.spy(testCityBuilderStore.genericMetrics, "addMetrics");

        const apiUrl = "urlsihshoif";
        const underTest: SonarQubeMetricsService = new SonarQubeMetricsService(apiUrl);

        const expectedMetrics: SonarQubeApiMetric[] = [];
        expectedMetrics.push({
            id: 123,
            key: "ncloc",
            type: MetricType.STRING,
            name: linesOfCode,
            description: "",
        });

        // eslint-disable-next-line sonarjs/no-identical-functions
        Sinon.stub(underTest, "callApi").resolves({
            data: {
                metrics: expectedMetrics,
            },
        });

        underTest
            .loadAvailableMetrics()
            .then(() => {
                Sinon.assert.calledWith(spyAdd, []);
                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });

    it("should set app status at the beginning and in the end", (done) => {
        createMockInjection(new CityBuilderStore());
        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());
        const spyLoad = Sinon.spy(testAppStatusStore, "load");
        const spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        const underTest: SonarQubeMetricsService = new SonarQubeMetricsService("urlsihshoif");

        Sinon.stub(underTest, "callApi").resolves({
            data: {
                metrics: [],
            },
        });

        underTest
            .loadAvailableMetrics()
            .then(() => {
                assert(spyLoad.calledWith(SonarQubeMetricsService.LOAD_METRICS));
                assert(spyLoadComplete.calledWith(SonarQubeMetricsService.LOAD_METRICS));
                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });

    it("should load again if more results", (done) => {
        createMockInjection(new CityBuilderStore());
        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());
        const spyLoad = Sinon.spy(testAppStatusStore, "load");
        const spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        const underTest: SonarQubeMetricsService = new SonarQubeMetricsService("urlsihshoif");

        const spyCallApi = Sinon.stub(underTest, "callApi");
        spyCallApi.onFirstCall().resolves({
            data: {
                metrics: [],
                p: 1,
                ps: 20,
                total: 30,
            },
        });
        spyCallApi.onSecondCall().resolves({
            data: {
                metrics: [],
                p: 2,
                ps: 20,
                total: 30,
            },
        });

        underTest
            .loadAvailableMetrics()
            .then(() => {
                assert(spyLoad.calledWith(SonarQubeMetricsService.LOAD_METRICS));
                assert(spyCallApi.calledTwice);
                assert(spyLoadComplete.calledWith(SonarQubeMetricsService.LOAD_METRICS));

                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });

    it("should react on errors", (done) => {
        createMockInjection(new CityBuilderStore());
        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());
        const spyLoad = Sinon.spy(testAppStatusStore, "load");
        const spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");
        const spyError = Sinon.spy(testAppStatusStore, "error");

        const underTest: SonarQubeMetricsService = new SonarQubeMetricsService("urlsihshoif");

        Sinon.stub(underTest, "callApi").rejects({
            response: {
                statusText: "not working",
            },
        });

        underTest
            .loadAvailableMetrics()
            .then(() => undefined)
            .catch(() => {
                assert(spyLoad.calledWith(SonarQubeMetricsService.LOAD_METRICS));
                assert(spyLoadComplete.calledWith(SonarQubeMetricsService.LOAD_METRICS));
                assert(spyError.calledOnce);
                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });

    it("should react on errors of the second call", (done) => {
        createMockInjection(new CityBuilderStore());
        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());
        const spyLoad = Sinon.spy(testAppStatusStore, "load");
        const spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        const underTest: SonarQubeMetricsService = new SonarQubeMetricsService("urlsihshoif");

        const spyCallApi = Sinon.stub(underTest, "callApi");
        spyCallApi.onFirstCall().resolves({
            data: {
                metrics: [],
                p: 1,
                ps: 20,
                total: 30,
            },
        });
        spyCallApi.onSecondCall().rejects({
            response: {
                statusText: "not working",
            },
        });

        underTest
            .loadAvailableMetrics()
            .then(() => {
                assert.isNotOk({}, "Promise error");
                done();
            })
            // eslint-disable-next-line sonarjs/no-identical-functions
            .catch(() => {
                assert(spyLoad.calledWith(SonarQubeMetricsService.LOAD_METRICS));
                assert(spyCallApi.calledTwice);
                assert(spyLoadComplete.calledWith(SonarQubeMetricsService.LOAD_METRICS));

                done();
            });
    });
});
