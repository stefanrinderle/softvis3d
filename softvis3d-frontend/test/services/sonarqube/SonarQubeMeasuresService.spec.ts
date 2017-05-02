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
// import {assert, expect} from "chai";
// import {AppStatusStore} from "../../../src/stores/AppStatusStore";
// import * as Sinon from "sinon";
// import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
// import SonarQubeMeasuresService from "../../../src/services/sonarqube/SonarQubeMeasuresService";
// import {SceneStore} from "../../../src/stores/SceneStore";
// import VisualizationOptions from "../../../src/classes/VisualizationOptions";

describe("SonarQubeMeasuresService", () => {

    // it("should call backend to get visualization", (done) => {
    //     let clock = Sinon.useFakeTimers();
    //
    //     let testAppStatusStore: AppStatusStore = new AppStatusStore();
    //     let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
    //     let testSceneStore: SceneStore = new SceneStore();
    //     testSceneStore.scmMetricLoaded = true;
    //
    //     let spyLoad = Sinon.spy(testAppStatusStore, "load");
    //     let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");
    //
    //     let apiUrl: string = "urlsihshoif";
    //     let projectKey: string = "sdufsofin";
    //     let underTest: SonarQubeLegacyService =
    //         new SonarQubeLegacyService(apiUrl, projectKey, testAppStatusStore, testCityBuilderStore, testSceneStore);
    //
    //     let expectedData = {
    //         testData: "disuffsiug"
    //     };
    //
    //     let spyCallApi = Sinon.stub(underTest, "callApi", () => {
    //         return Promise.resolve({
    //             data: expectedData
    //         });
    //     });
    //
    //     underTest.loadLegacyBackend(VisualizationOptions.createDefault());
    //
    //     let returnPromise: Promise<any> = Promise.resolve({});
    //     let returnPromise2: Promise<any> = Promise.resolve({});
    //     let returnPromise3: Promise<any> = Promise.resolve({});
    //     clock.tick(10);
    //     returnPromise.then(() => {
    //         Sinon.assert.called(spyCallApi);
    //         assert(spyLoad.calledWith(SonarQubeLegacyService.LOAD_LEGACY));
    //         assert(spyLoadComplete.calledWith(SonarQubeLegacyService.LOAD_LEGACY));
    //         expect(testSceneStore.scmMetricLoaded).to.be.eq(false);
    //         expect(testSceneStore.legacyData).to.be.eq(expectedData);
    //         clock.tick(10);
    //         returnPromise2.then(() => {
    //             clock.tick(10);
    //             returnPromise3.then(() => {
    //                 expect(testCityBuilderStore.initiateBuildProcess).to.be.false;
    //                 done();
    //             }).catch((error) => done(error));
    //         }).catch((error) => done(error));
    //     }).catch((error) => done(error));
    // });
    //
    // it("should NOT call backend with the same parameters", (done) => {
    //     let clock = Sinon.useFakeTimers();
    //
    //     let testAppStatusStore: AppStatusStore = new AppStatusStore();
    //     let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
    //     let testSceneStore: SceneStore = new SceneStore();
    //     testSceneStore.scmMetricLoaded = true;
    //
    //     let spyLoad = Sinon.spy(testAppStatusStore, "load");
    //     let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");
    //
    //     let apiUrl: string = "urlsihshoif";
    //     let projectKey: string = "sdufsofin";
    //     let underTest: SonarQubeLegacyService =
    //         new SonarQubeLegacyService(apiUrl, projectKey, testAppStatusStore, testCityBuilderStore, testSceneStore);
    //
    //     let expectedData = {
    //         testData: "disuffsiug"
    //     };
    //
    //     let spyCallApi = Sinon.stub(underTest, "callApi", () => {
    //         return Promise.resolve({
    //             data: expectedData
    //         });
    //     });
    //
    //     underTest.loadLegacyBackend(VisualizationOptions.createDefault());
    //
    //     let returnPromise: Promise<any> = Promise.resolve({});
    //     let returnPromise2: Promise<any> = Promise.resolve({});
    //     clock.tick(10);
    //     returnPromise.then(() => {
    //         underTest.loadLegacyBackend(VisualizationOptions.createDefault());
    //
    //         clock.tick(10);
    //         returnPromise2.then(() => {
    //             Sinon.assert.calledOnce(spyCallApi);
    //             assert(spyLoad.calledTwice);
    //             assert(spyLoadComplete.calledTwice);
    //             done();
    //         }).catch((error) => done(error));
    //     }).catch((error) => done(error));
    // });
    //
    // it("should request all predefined metrics", (done) => {
    //     let clock = Sinon.useFakeTimers();
    //
    //     let testAppStatusStore: AppStatusStore = new AppStatusStore();
    //     let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
    //     let testSceneStore: SceneStore = new SceneStore();
    //
    //     let apiUrl: string = "urlsihshoif";
    //     let projectKey: string = "sdufsofin";
    //     let underTest: SonarQubeLegacyService =
    //         new SonarQubeLegacyService(apiUrl, projectKey, testAppStatusStore, testCityBuilderStore, testSceneStore);
    //
    //     let expectedData = {
    //         testData: "disuffsiug"
    //     };
    //
    //     let spyCallApi = Sinon.stub(underTest, "callApi", () => {
    //         return Promise.resolve({
    //             data: expectedData
    //         });
    //     });
    //
    //     underTest.loadLegacyBackend(VisualizationOptions.createDefault());
    //
    //     let returnPromise: Promise<any> = Promise.resolve({});
    //     clock.tick(10);
    //     returnPromise.then(() => {
    //         assert(spyCallApi.called);
    //
    //         expect(spyCallApi.args[0][1].params.metrics)
    //             .to.be.eq("complexity,ncloc,coverage,violations,new_violations,open_issues");
    //
    //         done();
    //     }).catch((error) => done(error));
    // });
    //
    // it("should react on internal errors", (done) => {
    //     let clock = Sinon.useFakeTimers();
    //
    //     let testAppStatusStore: AppStatusStore = new AppStatusStore();
    //     let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
    //     let testSceneStore: SceneStore = new SceneStore();
    //
    //     let spyLoad = Sinon.spy(testAppStatusStore, "load");
    //     let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");
    //     let spyError = Sinon.spy(testAppStatusStore, "error");
    //
    //     let apiUrl: string = "urlsihshoif";
    //     let projectKey: string = "sdufsofin";
    //     let underTest: SonarQubeLegacyService =
    //         new SonarQubeLegacyService(apiUrl, projectKey, testAppStatusStore, testCityBuilderStore, testSceneStore);
    //
    //     let spyCallApi = Sinon.stub(underTest, "callApi", () => {
    //         return Promise.reject({data: {message: "Error message"}});
    //     });
    //
    //     underTest.loadLegacyBackend(VisualizationOptions.createDefault());
    //
    //     let returnPromise: Promise<any> = Promise.resolve({});
    //     let returnPromise2: Promise<any> = Promise.resolve({});
    //     clock.tick(10);
    //     returnPromise.then(() => {
    //         returnPromise2.then(() => {
    //             clock.tick(10);
    //             assert(spyCallApi.called);
    //             assert(spyLoad.calledWith(SonarQubeLegacyService.LOAD_LEGACY));
    //             assert(spyLoadComplete.calledWith(SonarQubeLegacyService.LOAD_LEGACY));
    //             assert(spyError.called);
    //             done();
    //         }).catch((error) => done(error));
    //     }).catch((error) => done(error));
    // });
    //
    // it("should react on api", (done) => {
    //     let clock = Sinon.useFakeTimers();
    //
    //     let testAppStatusStore: AppStatusStore = new AppStatusStore();
    //     let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
    //     let testSceneStore: SceneStore = new SceneStore();
    //
    //     let spyLoad = Sinon.spy(testAppStatusStore, "load");
    //     let spyLoadComplete = Sinon.spy(testAppStatusStore, "loadComplete");
    //     let spyError = Sinon.spy(testAppStatusStore, "error");
    //
    //     let apiUrl: string = "urlsihshoif";
    //     let projectKey: string = "sdufsofin";
    //     let underTest: SonarQubeLegacyService =
    //         new SonarQubeLegacyService(apiUrl, projectKey, testAppStatusStore, testCityBuilderStore, testSceneStore);
    //
    //     let spyCallApi = Sinon.stub(underTest, "callApi", () => {
    //         return Promise.reject({
    //             response: {
    //                 statusText: "osidhfosihdf"
    //             }
    //         });
    //     });
    //
    //     underTest.loadLegacyBackend(VisualizationOptions.createDefault());
    //
    //     let returnPromise: Promise<any> = Promise.resolve({});
    //     let returnPromise2: Promise<any> = Promise.resolve({});
    //     clock.tick(10);
    //     returnPromise.then(() => {
    //         returnPromise2.then(() => {
    //             clock.tick(10);
    //             assert(spyCallApi.called);
    //             assert(spyLoad.calledWith(SonarQubeLegacyService.LOAD_LEGACY));
    //             assert(spyLoadComplete.calledWith(SonarQubeLegacyService.LOAD_LEGACY));
    //             assert(spyError.called);
    //             done();
    //         }).catch((error) => done(error));
    //     }).catch((error) => done(error));
    // });

});
