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
import { TreeElement } from "../../../src/classes/TreeElement";
import ScmCalculatorService from "../../../src/services/sonarqube/ScmCalculatorService";
import SonarQubeScmService from "../../../src/services/sonarqube/SonarQubeScmService";
import TreeService from "../../../src/services/TreeService";
import AppStatusStore from "../../../src/stores/AppStatusStore";
import SceneStore from "../../../src/stores/SceneStore";
import { createDefaultFileWithIdAndParent } from "../../classes/TreeElement.spec";
import { createMock, createMockInjection } from "../../Helper";

describe("SonarQubeScmService", () => {
    it("should check if metric is available if its available", (done) => {
        createMockInjection(new AppStatusStore());

        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        const exampleData: any = {};
        testSceneStore.projectData = exampleData;

        const apiUrl = "urlsihshoif";
        const underTest: SonarQubeScmService = new SonarQubeScmService(apiUrl);

        mockTreeServiceGetAllFiles([createTestTreeElement("test")]);

        const measure: string[] = [];
        const measures: any = [];
        measures.push(measure);

        const localScmCalculator = createMock(ScmCalculatorService);
        localScmCalculator.createMetric.returns({
            lineNumber: 1,
            authorName: "srinderle",
            lastCommit: "oisdfosidj",
            lastCommitRevision: "soidufhosidjf",
        });
        localScmCalculator.calcNumberOfAuthors.returns(4);

        Sinon.stub(underTest, "callApi").resolves({
            data: {
                scm: measures,
            },
        });

        underTest
            .checkScmInfosAvailable()
            .then((result) => {
                expect(result).to.be.true;

                done();
            })
            .catch((error) => {
                assert.isNotOk(error, "checkScmInfosAvailable promise result error");
                done();
            });
    });

    it("should check if metric is available if its NOT available", (done) => {
        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());

        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        const exampleData: any = {};
        testSceneStore.projectData = exampleData;

        const apiUrl = "urlsihshoif";
        const underTest: SonarQubeScmService = new SonarQubeScmService(apiUrl);

        const statusStub = Sinon.stub(testAppStatusStore, "status");

        mockTreeServiceGetAllFiles([createTestTreeElement("test")]);

        const measure: string[] = [];
        const measures: any = [];
        measures.push(measure);

        const localScmCalculator = createMock(ScmCalculatorService);
        localScmCalculator.createMetric.returns({});
        localScmCalculator.calcNumberOfAuthors.returns(0);

        // eslint-disable-next-line sonarjs/no-identical-functions
        Sinon.stub(underTest, "callApi").resolves({
            data: {
                scm: measures,
            },
        });

        underTest
            .checkScmInfosAvailable()
            .then((result) => {
                expect(result).to.be.false;
                assert(statusStub.calledOnce);

                statusStub.restore();
                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });

    it("should call backend and add metric", (done) => {
        createMock(ScmCalculatorService);
        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());

        const loadStub = Sinon.stub(testAppStatusStore, "load");
        const loadCompleteStub = Sinon.stub(testAppStatusStore, "loadComplete");
        const loadStatusUpdateStub = Sinon.stub(testAppStatusStore, "loadStatusUpdate");

        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        const exampleData: any = {};
        testSceneStore.projectData = exampleData;

        const apiUrl = "urlsihshoif";
        const underTest: SonarQubeScmService = new SonarQubeScmService(apiUrl);

        const treeElement = createTestTreeElement("test");
        mockTreeServiceGetAllFiles([treeElement]);

        const measure: string[] = [];
        const measures: any = [];
        measures.push(measure);

        const localScmCalculator = createMock(ScmCalculatorService);
        localScmCalculator.createMetric.returns({
            lineNumber: 1,
            authorName: "srinderle",
            lastCommit: "oisdfosidj",
            lastCommitRevision: "soidufhosidjf",
        });
        localScmCalculator.calcNumberOfAuthors.returns(4);

        // eslint-disable-next-line sonarjs/no-identical-functions
        Sinon.stub(underTest, "callApi").resolves({
            data: {
                scm: measures,
            },
        });

        underTest
            .loadScmInfos()
            .then(() => {
                assert(
                    Object.prototype.hasOwnProperty.call(treeElement.measures, "number_of_authors")
                );
                expect(treeElement.measures.number_of_authors).to.be.eq(4);

                assert(loadStub.called);
                assert(loadCompleteStub.called);
                assert(loadStatusUpdateStub.called);

                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });

    it("should call backend and add metric in batches", (done) => {
        createMock(ScmCalculatorService);
        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());
        const loadStub = Sinon.stub(testAppStatusStore, "load");
        const loadCompleteStub = Sinon.stub(testAppStatusStore, "loadComplete");
        const loadStatusUpdateStub = Sinon.stub(testAppStatusStore, "loadStatusUpdate");

        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        const exampleData: any = {};
        testSceneStore.projectData = exampleData;

        const apiUrl = "urlsihshoif";
        const underTest: SonarQubeScmService = new SonarQubeScmService(apiUrl);

        const treeElements: TreeElement[] = [];
        for (let i = 0; i < 90; i++) {
            treeElements.push(createTestTreeElement("test" + i));
        }
        mockTreeServiceGetAllFiles(treeElements);

        const measure: string[] = [];
        const measures: any = [];
        measures.push(measure);

        const localScmCalculator = createMock(ScmCalculatorService);
        localScmCalculator.createMetric.returns({
            lineNumber: 1,
            authorName: "srinderle",
            lastCommit: "oisdfosidj",
            lastCommitRevision: "soidufhosidjf",
        });
        localScmCalculator.calcNumberOfAuthors.returns(4);

        // eslint-disable-next-line sonarjs/no-identical-functions
        Sinon.stub(underTest, "callApi").resolves({
            data: {
                scm: measures,
            },
        });

        underTest
            .loadScmInfos()
            .then(() => {
                assert(
                    Object.prototype.hasOwnProperty.call(
                        treeElements[0].measures,
                        "number_of_authors"
                    )
                );
                expect(treeElements[0].measures.number_of_authors).to.be.eq(4);

                expect(treeElements[89].measures.number_of_authors).to.be.eq(4);

                assert(loadStub.called);
                assert(loadCompleteStub.called);
                assert(loadStatusUpdateStub.calledTwice);

                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });

    it("should do nothing if no data is available", (done) => {
        createMockInjection(new AppStatusStore());
        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        testSceneStore.projectData = null;

        const apiUrl = "urlsihshoif";
        const underTest: SonarQubeScmService = new SonarQubeScmService(apiUrl);

        underTest
            .loadScmInfos()
            .then(() => {
                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });

    it("should react on error", (done) => {
        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());

        const errorStub = Sinon.stub(testAppStatusStore, "error");

        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        const exampleData: any = {};
        testSceneStore.projectData = exampleData;

        const apiUrl = "urlsihshoif";
        const underTest: SonarQubeScmService = new SonarQubeScmService(apiUrl);

        mockTreeServiceGetAllFiles([createTestTreeElement("test")]);

        Sinon.stub(underTest, "callApi").callsFake(() => {
            Promise.reject({
                response: {
                    statusText: "not working",
                },
            });
        });

        underTest
            .loadScmInfos()
            .then(() => {
                assert(errorStub.called);

                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });
});

function createTestTreeElement(name: string, parent?: TreeElement): TreeElement {
    return createDefaultFileWithIdAndParent(name, parent);
}

function mockTreeServiceGetAllFiles(treeElements: TreeElement[]) {
    const localTreeService: any = createMock(TreeService);
    localTreeService.getAllFiles.returns(treeElements);
}
