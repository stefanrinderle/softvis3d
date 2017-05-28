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
import {AppStatusStore} from "../../../src/stores/AppStatusStore";
import * as Sinon from "sinon";
import SonarQubeScmService from "../../../src/services/sonarqube/SonarQubeScmService";
import {SceneStore} from "../../../src/stores/SceneStore";
import {TreeService} from "../../../src/services/TreeService";
import ScmCalculator from "../../../src/services/sonarqube/ScmCalculator";
import {TreeElement} from "../../../src/classes/TreeElement";

describe("SonarQubeScmService", () => {

    it("should check if metric is available if its available", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();

        let testSceneStore: SceneStore = new SceneStore();
        let exampleData: any = {};
        testSceneStore.projectData = exampleData;

        let apiUrl: string = "urlsihshoif";
        let underTest: SonarQubeScmService = new SonarQubeScmService(testAppStatusStore,
            testSceneStore, apiUrl);

        let treeServiceMock = Sinon.stub(TreeService, "getAllFiles");
        let treeElements: TreeElement[] = [];
        treeElements.push(createTestTreeElement("test"));
        treeServiceMock.returns(treeElements);

        let measure: string[] = [];
        let measures: any = [];
        measures.push(measure);

        let scmCalculatorCreateMetricMock = Sinon.stub(ScmCalculator, "createMetric");
        scmCalculatorCreateMetricMock.returns({
            lineNumber: 1,
            authorName: "srinderle",
            lastCommit: "oisdfosidj",
            lastCommitRevision: "soidufhosidjf"
        });
        let scmCalculatorCaclAuthorsMock = Sinon.stub(ScmCalculator, "calcNumberOfAuthors");
        scmCalculatorCaclAuthorsMock.returns(4);

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.resolve({
                data: {
                    scm: measures
                }
            });
        });

        underTest.checkScmInfosAvailable().then((result) => {
            expect(result).to.be.true;

            treeServiceMock.restore();
            scmCalculatorCreateMetricMock.restore();
            scmCalculatorCaclAuthorsMock.restore();
            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should check if metric is available if its NOT available", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();

        let testSceneStore: SceneStore = new SceneStore();
        let exampleData: any = {};
        testSceneStore.projectData = exampleData;

        let apiUrl: string = "urlsihshoif";
        let underTest: SonarQubeScmService = new SonarQubeScmService(testAppStatusStore,
            testSceneStore, apiUrl);

        let statusStub = Sinon.stub(testAppStatusStore, "status");

        let treeServiceMock = Sinon.stub(TreeService, "getAllFiles");
        let treeElements: TreeElement[] = [];
        treeElements.push(createTestTreeElement("test"));
        treeServiceMock.returns(treeElements);

        let measure: string[] = [];
        let measures: any = [];
        measures.push(measure);

        let scmCalculatorCreateMetricMock = Sinon.stub(ScmCalculator, "createMetric");
        scmCalculatorCreateMetricMock.returns({});
        let scmCalculatorCaclAuthorsMock = Sinon.stub(ScmCalculator, "calcNumberOfAuthors");
        scmCalculatorCaclAuthorsMock.returns(0);

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.resolve({
                data: {
                    scm: measures
                }
            });
        });

        underTest.checkScmInfosAvailable().then((result) => {
            expect(result).to.be.false;
            assert(statusStub.calledOnce);

            treeServiceMock.restore();
            scmCalculatorCreateMetricMock.restore();
            scmCalculatorCaclAuthorsMock.restore();
            statusStub.restore();
            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should call backend and add metric", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();

        let loadStub = Sinon.stub(testAppStatusStore, "load");
        let loadCompleteStub = Sinon.stub(testAppStatusStore, "loadComplete");
        let loadStatusUpdateStub = Sinon.stub(testAppStatusStore, "loadStatusUpdate");

        let testSceneStore: SceneStore = new SceneStore();
        let exampleData: any = {};
        testSceneStore.projectData = exampleData;

        let apiUrl: string = "urlsihshoif";
        let underTest: SonarQubeScmService = new SonarQubeScmService(testAppStatusStore,
            testSceneStore, apiUrl);

        let treeServiceMock = Sinon.stub(TreeService, "getAllFiles");
        let treeElements: TreeElement[] = [];
        treeElements.push(createTestTreeElement("test"));
        treeServiceMock.returns(treeElements);

        let measure: string[] = [];
        let measures: any = [];
        measures.push(measure);

        let scmCalculatorCreateMetricMock = Sinon.stub(ScmCalculator, "createMetric");
        scmCalculatorCreateMetricMock.returns({
            lineNumber: 1,
            authorName: "srinderle",
            lastCommit: "oisdfosidj",
            lastCommitRevision: "soidufhosidjf"
        });
        let scmCalculatorCaclAuthorsMock = Sinon.stub(ScmCalculator, "calcNumberOfAuthors");
        scmCalculatorCaclAuthorsMock.returns(4);

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.resolve({
                data: {
                    scm: measures
                }
            });
        });

        underTest.loadScmInfos().then(() => {
            assert(treeElements[0].measures.hasOwnProperty("number_of_authors"));
            expect(treeElements[0].measures.number_of_authors).to.be.eq(4);

            assert(loadStub.called);
            assert(loadCompleteStub.called);
            assert(loadStatusUpdateStub.called);

            treeServiceMock.restore();
            scmCalculatorCreateMetricMock.restore();
            scmCalculatorCaclAuthorsMock.restore();
            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should call backend and add metric in batches", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let loadStub = Sinon.stub(testAppStatusStore, "load");
        let loadCompleteStub = Sinon.stub(testAppStatusStore, "loadComplete");
        let loadStatusUpdateStub = Sinon.stub(testAppStatusStore, "loadStatusUpdate");

        let testSceneStore: SceneStore = new SceneStore();
        let exampleData: any = {};
        testSceneStore.projectData = exampleData;

        let apiUrl: string = "urlsihshoif";
        let underTest: SonarQubeScmService = new SonarQubeScmService(testAppStatusStore,
            testSceneStore, apiUrl);

        let treeServiceMock = Sinon.stub(TreeService, "getAllFiles");
        let treeElements: TreeElement[] = [];
        for (let i = 0; i < 90; i++) {
            treeElements.push(createTestTreeElement("test" + i));
        }
        treeServiceMock.returns(treeElements);

        let measure: string[] = [];
        let measures: any = [];
        measures.push(measure);

        let scmCalculatorCreateMetricMock = Sinon.stub(ScmCalculator, "createMetric");
        scmCalculatorCreateMetricMock.returns({
            lineNumber: 1,
            authorName: "srinderle",
            lastCommit: "oisdfosidj",
            lastCommitRevision: "soidufhosidjf"
        });
        let scmCalculatorCaclAuthorsMock = Sinon.stub(ScmCalculator, "calcNumberOfAuthors");
        scmCalculatorCaclAuthorsMock.returns(4);

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.resolve({
                data: {
                    scm: measures
                }
            });
        });

        underTest.loadScmInfos().then(() => {
            assert(treeElements[0].measures.hasOwnProperty("number_of_authors"));
            expect(treeElements[0].measures.number_of_authors).to.be.eq(4);

            expect(treeElements[89].measures.number_of_authors).to.be.eq(4);

            assert(loadStub.called);
            assert(loadCompleteStub.called);
            assert(loadStatusUpdateStub.calledTwice);

            treeServiceMock.restore();
            scmCalculatorCreateMetricMock.restore();
            scmCalculatorCaclAuthorsMock.restore();
            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should do nothing if no data is available", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let testSceneStore: SceneStore = new SceneStore();
        testSceneStore.projectData = null;

        let apiUrl: string = "urlsihshoif";
        let underTest: SonarQubeScmService = new SonarQubeScmService(testAppStatusStore,
            testSceneStore, apiUrl);

        underTest.loadScmInfos().then(() => {
            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should react on error", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();

        let errorStub = Sinon.stub(testAppStatusStore, "error");

        let testSceneStore: SceneStore = new SceneStore();
        let exampleData: any = {};
        testSceneStore.projectData = exampleData;

        let apiUrl: string = "urlsihshoif";
        let underTest: SonarQubeScmService = new SonarQubeScmService(testAppStatusStore,
            testSceneStore, apiUrl);

        let treeServiceMock = Sinon.stub(TreeService, "getAllFiles");
        let treeElements: TreeElement[] = [];
        treeElements.push(createTestTreeElement("test"));
        treeServiceMock.returns(treeElements);

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.reject({
                response: {
                    statusText: "not working"
                }
            });
        });

        underTest.loadScmInfos().then(() => {
            assert(errorStub.called);

            treeServiceMock.restore();
            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

});

function createTestTreeElement(name: string, parent?: TreeElement): TreeElement {
    return new TreeElement(name, name, {}, "", "", true, parent);
}