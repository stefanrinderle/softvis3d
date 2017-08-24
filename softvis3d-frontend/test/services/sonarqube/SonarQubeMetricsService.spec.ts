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
import {assert} from "chai";
import SonarQubeMetricsService, {SonarQubeApiMetric} from "../../../src/services/sonarqube/SonarQubeMetricsService";
import {AppStatusStore} from "../../../src/stores/AppStatusStore";
import * as Sinon from "sinon";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import {MetricType} from "../../../src/classes/MetricType";

describe("SonarQubeMetricsService", () => {

    it("should call backend and add metric", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let spyAdd = Sinon.spy(testCityBuilderStore.genericMetrics, "addMetrics");

        let apiUrl: string = "urlsihshoif";
        let underTest: SonarQubeMetricsService = new SonarQubeMetricsService(testAppStatusStore,
            testCityBuilderStore, apiUrl);

        let expectedMetrics: SonarQubeApiMetric[] = [];
        expectedMetrics.push({
            id: 123,
            key: "ncloc",
            type: MetricType.INT,
            name: "lines of code",
            description: ""
        });

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.resolve({
                data: {
                    metrics: expectedMetrics
                }
            });
        });

        underTest.loadAvailableMetrics().then(() => {
            Sinon.assert.called(spyAdd);
            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should filter hidden metrics", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let spyAdd = Sinon.spy(testCityBuilderStore.genericMetrics, "addMetrics");

        let apiUrl: string = "urlsihshoif";
        let underTest: SonarQubeMetricsService = new SonarQubeMetricsService(testAppStatusStore,
            testCityBuilderStore, apiUrl);

        let expectedMetrics: SonarQubeApiMetric[] = [];
        expectedMetrics.push({
            id: 123,
            key: "ncloc",
            type: MetricType.INT,
            name: "lines of code",
            hidden: false,
            description: ""
        });

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.resolve({
                data: {
                    metrics: expectedMetrics
                }
            });
        });

        underTest.loadAvailableMetrics().then(() => {
            Sinon.assert.calledWith(spyAdd, []);
            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should filter string metrics", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let spyAdd = Sinon.spy(testCityBuilderStore.genericMetrics, "addMetrics");

        let apiUrl: string = "urlsihshoif";
        let underTest: SonarQubeMetricsService = new SonarQubeMetricsService(testAppStatusStore,
            testCityBuilderStore, apiUrl);

        let expectedMetrics: SonarQubeApiMetric[] = [];
        expectedMetrics.push({
            id: 123,
            key: "ncloc",
            type: MetricType.STRING,
            name: "lines of code",
            description: ""
        });

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.resolve({
                data: {
                    metrics: expectedMetrics
                }
            });
        });

        underTest.loadAvailableMetrics().then(() => {
            Sinon.assert.calledWith(spyAdd, []);
            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should set app status at the beginning and in the end", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let spyLoad = Sinon.spy(testAppStatusStore, "load");
        let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        let underTest: SonarQubeMetricsService = new SonarQubeMetricsService(testAppStatusStore,
            testCityBuilderStore, "urlsihshoif");

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.resolve({
                data: {
                    metrics: []
                }
            });
        });

        underTest.loadAvailableMetrics().then(() => {
            assert(spyLoad.calledWith(SonarQubeMetricsService.LOAD_METRICS));
            assert(spyLoadComplete.calledWith(SonarQubeMetricsService.LOAD_METRICS));
            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should load again if more results", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let spyLoad = Sinon.spy(testAppStatusStore, "load");
        let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        let underTest: SonarQubeMetricsService = new SonarQubeMetricsService(testAppStatusStore,
            testCityBuilderStore, "urlsihshoif");

        let spyCallApi = Sinon.stub(underTest, "callApi");
        spyCallApi.onFirstCall().returns(
            Promise.resolve({
                data: {
                    metrics: [],
                    p: 1,
                    ps: 20,
                    total: 30
                }
            }));
        spyCallApi.onSecondCall().returns(
            Promise.resolve({
                data: {
                    metrics: [],
                    p: 2,
                    ps: 20,
                    total: 30
                }
            }));

        underTest.loadAvailableMetrics().then(() => {
            assert(spyLoad.calledWith(SonarQubeMetricsService.LOAD_METRICS));
            assert(spyCallApi.calledTwice);
            assert(spyLoadComplete.calledWith(SonarQubeMetricsService.LOAD_METRICS));

            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should react on errors", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let spyLoad = Sinon.spy(testAppStatusStore, "load");
        let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");
        let spyError = Sinon.spy(testAppStatusStore, "error");

        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        let underTest: SonarQubeMetricsService = new SonarQubeMetricsService(testAppStatusStore,
            testCityBuilderStore, "urlsihshoif");

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.reject({
                response: {
                    statusText: "not working"
                }
            });
        });

        underTest.loadAvailableMetrics().then(() => undefined).catch(() => {
            assert(spyLoad.calledWith(SonarQubeMetricsService.LOAD_METRICS));
            assert(spyLoadComplete.calledWith(SonarQubeMetricsService.LOAD_METRICS));
            assert(spyError.calledOnce);
            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should react on errors of the second call", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let spyLoad = Sinon.spy(testAppStatusStore, "load");
        let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        let underTest: SonarQubeMetricsService = new SonarQubeMetricsService(testAppStatusStore,
            testCityBuilderStore, "urlsihshoif");

        let spyCallApi = Sinon.stub(underTest, "callApi");
        spyCallApi.onFirstCall().returns(
            Promise.resolve({
                data: {
                    metrics: [],
                    p: 1,
                    ps: 20,
                    total: 30
                }
            }));
        spyCallApi.onSecondCall().returns(
            Promise.reject({
                response: {
                    statusText: "not working"
                }
            })
        );

        underTest.loadAvailableMetrics().then(() => {
            assert.isNotOk({}, "Promise error");
            done();
        }).catch(() => {
            assert(spyLoad.calledWith(SonarQubeMetricsService.LOAD_METRICS));
            assert(spyCallApi.calledTwice);
            assert(spyLoadComplete.calledWith(SonarQubeMetricsService.LOAD_METRICS));

            done();
        });
    });

});