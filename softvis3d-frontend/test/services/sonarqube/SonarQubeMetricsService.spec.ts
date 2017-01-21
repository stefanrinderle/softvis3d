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
import SonarQubeMetricsService, {SonarQubeApiMetric} from "../../../src/services/sonarqube/SonarQubeMetricsService";
import {AppStatusStore} from "../../../src/stores/AppStatusStore";
import * as Sinon from "sinon";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";

describe("SonarQubeMetricsService", () => {

    it("should call backend and add metric", (done) => {
        let clock = Sinon.useFakeTimers();

        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let spyAdd = Sinon.spy(testCityBuilderStore.genericMetrics, "addMetrics");

        let apiUrl: string = "urlsihshoif";
        let underTest: SonarQubeMetricsService =
            new SonarQubeMetricsService(apiUrl, testAppStatusStore, testCityBuilderStore);

        let expectedMetrics: SonarQubeApiMetric[] = [];
        expectedMetrics.push({
           id: 123,
           key: "ncloc",
           type: "INT",
           name: "lines of code"
        });

        Sinon.stub(underTest, "callApi", () => {
            return Promise.resolve({
                data: {
                    metrics: expectedMetrics
                }
            });
        });

        underTest.loadAvailableMetrics();

        let returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            Sinon.assert.called(spyAdd);
            done();
        }).catch((error) => done(error));
    });

    it("should filter hidden metrics", (done) => {
        let clock = Sinon.useFakeTimers();

        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let spyAdd = Sinon.spy(testCityBuilderStore.genericMetrics, "addMetrics");

        let apiUrl: string = "urlsihshoif";
        let underTest: SonarQubeMetricsService =
            new SonarQubeMetricsService(apiUrl, testAppStatusStore, testCityBuilderStore);

        let expectedMetrics: SonarQubeApiMetric[] = [];
        expectedMetrics.push({
            id: 123,
            key: "ncloc",
            type: "INT",
            name: "lines of code",
            hidden: false
        });

        Sinon.stub(underTest, "callApi", () => {
            return Promise.resolve({
                data: {
                    metrics: expectedMetrics
                }
            });
        });

        underTest.loadAvailableMetrics();

        let returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            Sinon.assert.calledWith(spyAdd, []);
            // TODO: would expect not called instead of called empty here.
            // Sinon.assert.notCalled(spyAdd);
            done();
        }).catch((error) => done(error));
    });

    it("should filter string metrics", (done) => {
        let clock = Sinon.useFakeTimers();

        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let spyAdd = Sinon.spy(testCityBuilderStore.genericMetrics, "addMetrics");

        let apiUrl: string = "urlsihshoif";
        let underTest: SonarQubeMetricsService =
            new SonarQubeMetricsService(apiUrl, testAppStatusStore, testCityBuilderStore);

        let expectedMetrics: SonarQubeApiMetric[] = [];
        expectedMetrics.push({
            id: 123,
            key: "ncloc",
            type: "STRING",
            name: "lines of code"
        });

        Sinon.stub(underTest, "callApi", () => {
            return Promise.resolve({
                data: {
                    metrics: expectedMetrics
                }
            });
        });

        underTest.loadAvailableMetrics();

        let returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            Sinon.assert.calledWith(spyAdd, []);
            // TODO: would expect not calld instead of called empty here.
            // Sinon.assert.notCalled(spyAdd);
            done();
        }).catch((error) => done(error));

    });

    it("should set app status at the beginning and in the end", (done) => {
        let clock = Sinon.useFakeTimers();

        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let spyLoad = Sinon.spy(testAppStatusStore, "load");
        let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        let underTest: SonarQubeMetricsService =
            new SonarQubeMetricsService("urlsihshoif", testAppStatusStore, testCityBuilderStore);

        Sinon.stub(underTest, "callApi", () => {
            return Promise.resolve({
                data: {
                    metrics: []
                }
            });
        });

        underTest.loadAvailableMetrics();

        let returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            assert(spyLoad.calledWith(SonarQubeMetricsService.LOAD_METRICS));
            assert(spyLoadComplete.calledWith(SonarQubeMetricsService.LOAD_METRICS));
            done();
        }).catch((error) => done(error));

    });

    it("should load again if more results", (done) => {
        let clock = Sinon.useFakeTimers();

        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let spyLoad = Sinon.spy(testAppStatusStore, "load");
        let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");

        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        let underTest: SonarQubeMetricsService =
            new SonarQubeMetricsService("urlsihshoif", testAppStatusStore, testCityBuilderStore);

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

        underTest.loadAvailableMetrics();

        let returnPromise: Promise<any> = Promise.resolve({});
        let returnPromise2: Promise<any> = Promise.resolve({});
        clock.tick(50);
        returnPromise.then(() => {
            assert(spyLoad.calledWith(SonarQubeMetricsService.LOAD_METRICS));
            assert(spyLoadComplete.notCalled);
            clock.tick(50);
            returnPromise2.then(() => {
                assert(spyCallApi.calledTwice);
                assert(spyLoadComplete.calledWith(SonarQubeMetricsService.LOAD_METRICS));
                expect(true).to.be.true;
                done();
            }).catch((error) => done(error));
        }).catch((error) => done(error));
    });

});