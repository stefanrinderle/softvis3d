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
import SonarQubeMeasuresApiService from "../../../../src/services/sonarqube/measures/SonarQubeMeasuresApiService";
import {
    SonarQubeApiComponent,
    SonarQubeMeasureResponse, SQ_QUALIFIER_DIRECTORY, SQ_QUALIFIER_FILE, SQ_QUALIFIER_SUB_PROJECT
} from "../../../../src/services/sonarqube/measures/SonarQubeMeasureResponse";
import SonarQubeMeasuresTreeService from "../../../../src/services/sonarqube/measures/SonarQubeMeasuresTreeService";
import {TreeElement} from "../../../../src/classes/TreeElement";
import {AppStatusStore} from "../../../../src/stores/AppStatusStore";

describe("SonarQubeMeasuresTreeService", () => {

    it("should immediately resolve on response without components", (done) => {
        let measureApiService: any = Sinon.createStubInstance(SonarQubeMeasuresApiService);
        let testAppStatusStore: AppStatusStore = new AppStatusStore();

        let spyIncrementMax = Sinon.spy(testAppStatusStore, "loadStatusUpdateIncrementMax");
        let spyIncrementCurrent = Sinon.spy(testAppStatusStore, "loadStatusUpdateIncrementCurrent");

        let underTest: SonarQubeMeasuresTreeService =
            new SonarQubeMeasuresTreeService(testAppStatusStore, measureApiService);

        measureApiService.loadMeasures.returns(
            Promise.resolve(
                createResponseWithComponents([])
            )
        );

        let root: TreeElement = new TreeElement("", this.projectKey, {}, "", "", false);
        underTest.loadTree(root, "metricKeys").then(() => {
            assert(spyIncrementMax.called);
            assert(spyIncrementCurrent.called);
            assert(measureApiService.loadMeasures.called);
            expect(parent).to.be.eq(parent);

            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should call process dir level", (done) => {
        let measureApiService: any = Sinon.createStubInstance(SonarQubeMeasuresApiService);
        let testAppStatusStore: AppStatusStore = new AppStatusStore();

        Sinon.spy(testAppStatusStore, "loadStatusUpdateIncrementMax");
        Sinon.spy(testAppStatusStore, "loadStatusUpdateIncrementCurrent");

        let underTest: SonarQubeMeasuresTreeService =
            new SonarQubeMeasuresTreeService(testAppStatusStore, measureApiService);

        let components1: SonarQubeApiComponent[] = [{
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/src",
            qualifier: SQ_QUALIFIER_DIRECTORY
        }];
        let components2: SonarQubeApiComponent[] = [{
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/src/file.java",
            qualifier: SQ_QUALIFIER_FILE
        }];
        measureApiService.loadMeasures.onFirstCall().returns(
            Promise.resolve(
                createResponseWithComponents(components1)
            )
        );
        measureApiService.loadMeasures.onSecondCall().returns(
            Promise.resolve(
                createResponseWithComponents(components2)
            )
        );

        let root: TreeElement = new TreeElement("", this.projectKey, {}, "", "", false);
        underTest.loadTree(root, "metricKeys").then(() => {
            assert(measureApiService.loadMeasures.calledTwice);
            expect(root.children[0].children[0].path).to.be.eq("/src/file.java");

            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should call process sub.project level", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let measureApiService: any = Sinon.createStubInstance(SonarQubeMeasuresApiService);

        Sinon.spy(testAppStatusStore, "loadStatusUpdateIncrementMax");
        Sinon.spy(testAppStatusStore, "loadStatusUpdateIncrementCurrent");

        let underTest: SonarQubeMeasuresTreeService =
            new SonarQubeMeasuresTreeService(testAppStatusStore, measureApiService);

        let components1: SonarQubeApiComponent[] = [{
            id: "kjashdkh",
            key: "kjashdkh",
            measures: [],
            name: "",
            path: "",
            qualifier: SQ_QUALIFIER_SUB_PROJECT
        }];
        let components2: SonarQubeApiComponent[] = [{
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/",
            qualifier: SQ_QUALIFIER_DIRECTORY
        }, {
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/src",
            qualifier: SQ_QUALIFIER_DIRECTORY
        }];
        let components3: SonarQubeApiComponent[] = [{
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/src/file.java",
            qualifier: SQ_QUALIFIER_FILE
        }];
        measureApiService.loadMeasures.onFirstCall().returns(
            Promise.resolve(
                createResponseWithComponents(components1)
            )
        );
        measureApiService.loadMeasures.onSecondCall().returns(
            Promise.resolve(
                createResponseWithComponents(components2)
            )
        );
        measureApiService.loadMeasures.onThirdCall().returns(
            Promise.resolve(
                createResponseWithComponents(components3)
            )
        );

        let root: TreeElement = new TreeElement("", this.projectKey, {}, "", "", false);
        underTest.loadTree(root, "metricKeys").then(() => {
            assert(measureApiService.loadMeasures.calledThrice);
            expect(root.children[0].children[0].children[0].path).to.be.eq("/src/file.java");

            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should call service and react on errors", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let measureApiService: any = Sinon.createStubInstance(SonarQubeMeasuresApiService);

        Sinon.spy(testAppStatusStore, "loadStatusUpdateIncrementMax");
        Sinon.spy(testAppStatusStore, "loadStatusUpdateIncrementCurrent");

        let underTest: SonarQubeMeasuresTreeService =
            new SonarQubeMeasuresTreeService(testAppStatusStore, measureApiService);

        measureApiService.loadMeasures.returns(
            Promise.reject({
                response: {
                    statusText: "not working"
                }
            })
        );

        let root: TreeElement = new TreeElement("", this.projectKey, {}, "", "", false);
        underTest.loadTree(root, "metricKeys").then(() => {
            assert.isNotOk("Promise error", "works but should throw exception");

            done();
        }).catch((error) => {
            expect(error.response.statusText).to.be.eq("not working");
            done();
        });
    });

    it("should call service and react on errors the second call", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let measureApiService: any = Sinon.createStubInstance(SonarQubeMeasuresApiService);

        Sinon.spy(testAppStatusStore, "loadStatusUpdateIncrementMax");
        Sinon.spy(testAppStatusStore, "loadStatusUpdateIncrementCurrent");

        let underTest: SonarQubeMeasuresTreeService =
            new SonarQubeMeasuresTreeService(testAppStatusStore, measureApiService);

        let components1: SonarQubeApiComponent[] = [{
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/src",
            qualifier: SQ_QUALIFIER_DIRECTORY
        }];
        measureApiService.loadMeasures.onFirstCall().returns(
            Promise.resolve(
                createResponseWithComponents(components1)
            )
        );
        measureApiService.loadMeasures.onSecondCall().returns(
            Promise.reject({
                response: {
                    statusText: "not working"
                }
            })
        );

        let root: TreeElement = new TreeElement("", this.projectKey, {}, "", "", false);
        underTest.loadTree(root, "metricKeys").then(() => {
            assert.isNotOk("Promise error", "works but should throw exception");

            done();
        }).catch((error) => {
            expect(error.response.statusText).to.be.eq("not working");

            done();
        });
    });

    it("should call process sub.project level and react on errors", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let measureApiService: any = Sinon.createStubInstance(SonarQubeMeasuresApiService);

        Sinon.spy(testAppStatusStore, "loadStatusUpdateIncrementMax");
        Sinon.spy(testAppStatusStore, "loadStatusUpdateIncrementCurrent");

        let underTest: SonarQubeMeasuresTreeService =
            new SonarQubeMeasuresTreeService(testAppStatusStore, measureApiService);

        let components1: SonarQubeApiComponent[] = [{
            id: "kjashdkh",
            key: "kjashdkh",
            measures: [],
            name: "",
            path: "",
            qualifier: SQ_QUALIFIER_SUB_PROJECT
        }];
        let components2: SonarQubeApiComponent[] = [{
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/",
            qualifier: SQ_QUALIFIER_DIRECTORY
        }, {
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/src",
            qualifier: SQ_QUALIFIER_DIRECTORY
        }];
        measureApiService.loadMeasures.onFirstCall().returns(
            Promise.resolve(
                createResponseWithComponents(components1)
            )
        );
        measureApiService.loadMeasures.onSecondCall().returns(
            Promise.resolve(
                createResponseWithComponents(components2)
            )
        );
        measureApiService.loadMeasures.onThirdCall().returns(
            Promise.reject({
                response: {
                    statusText: "not working"
                }
            })
        );

        let root: TreeElement = new TreeElement("", this.projectKey, {}, "", "", false);
        underTest.loadTree(root, "metricKeys").then(() => {
            assert.isNotOk("Promise error", "works but should throw exception");

            done();
        }).catch((error) => {
            expect(error.response.statusText).to.be.eq("not working");

            done();
        });
    });

    /**
     * optimizeDirectoryStructure tests
     */

    it("should remove an empty dir as root child", () => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let measureApiService: any = Sinon.createStubInstance(SonarQubeMeasuresApiService);

        let underTest: SonarQubeMeasuresTreeService =
            new SonarQubeMeasuresTreeService(testAppStatusStore, measureApiService);

        let root: TreeElement = new TreeElement("", "", {}, "", "", false);
        let emptySubDir: TreeElement = new TreeElement("", "", {}, "", "", false);
        root.children.push(emptySubDir);

        underTest.optimizeDirectoryStructure(root);

        expect(root.children.length).to.be.eq(0);
    });

    it("should remove an multiple empty dirs", () => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let measureApiService: any = Sinon.createStubInstance(SonarQubeMeasuresApiService);

        let underTest: SonarQubeMeasuresTreeService =
            new SonarQubeMeasuresTreeService(testAppStatusStore, measureApiService);

        let root: TreeElement = new TreeElement("", "", {}, "", "", false);
        let emptySubDir: TreeElement = new TreeElement("", "", {}, "", "", false);
        root.children.push(emptySubDir);
        let emptySubDir2: TreeElement = new TreeElement("", "", {}, "", "", false);
        emptySubDir.children.push(emptySubDir2);

        underTest.optimizeDirectoryStructure(root);

        expect(root.children.length).to.be.eq(0);
    });

    it("should remove an empty dir after not empty dir", () => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let measureApiService: any = Sinon.createStubInstance(SonarQubeMeasuresApiService);

        let underTest: SonarQubeMeasuresTreeService =
            new SonarQubeMeasuresTreeService(testAppStatusStore, measureApiService);

        let root: TreeElement = new TreeElement("", "", {}, "", "", false);
        let subDir: TreeElement = new TreeElement("", "", {}, "", "/src", false);
        root.children.push(subDir);
        let file: TreeElement = new TreeElement("", "", {}, "", "/src/file.java", true);
        subDir.children.push(file);
        let emptySubDir2: TreeElement = new TreeElement("", "", {}, "/src/test", "", false);
        subDir.children.push(emptySubDir2);

        underTest.optimizeDirectoryStructure(root);

        expect(root.children.length).to.be.eq(1);
        expect(root.children[0].children.length).to.be.eq(1);
    });

    it("should remove consecutive empty dirs", () => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let measureApiService: any = Sinon.createStubInstance(SonarQubeMeasuresApiService);

        let underTest: SonarQubeMeasuresTreeService =
            new SonarQubeMeasuresTreeService(testAppStatusStore, measureApiService);

        let root: TreeElement = new TreeElement("", "1", {}, "", "", false);
        let subDir: TreeElement = new TreeElement("", "2", {}, "", "/src", false);
        subDir.parent = root;
        root.children.push(subDir);
        let subdir2: TreeElement = new TreeElement("", "3", {}, "", "/src/subdir2/", false);
        subdir2.parent = subDir;
        subDir.children.push(subdir2);
        let file: TreeElement = new TreeElement("", "4", {}, "", "/src/subdir2/file.java", true);
        file.parent = subdir2;
        subdir2.children.push(file);

        underTest.optimizeDirectoryStructure(root);

        expect(root.children.length).to.be.eq(1);
        expect(root.children[0].children[0]).to.be.eq(file);
    });

    it("should remove 2 empty dirs in the same folder", () => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let measureApiService: any = Sinon.createStubInstance(SonarQubeMeasuresApiService);

        let underTest: SonarQubeMeasuresTreeService =
            new SonarQubeMeasuresTreeService(testAppStatusStore, measureApiService);

        let root: TreeElement = new TreeElement("", "1", {}, "", "", false);
        let subDir: TreeElement = new TreeElement("", "2", {}, "", "/src", false);
        subDir.parent = root;
        root.children.push(subDir);
        let subdir2: TreeElement = new TreeElement("", "3", {}, "", "/src/subdir2", false);
        subdir2.parent = subDir;
        subDir.children.push(subdir2);
        let subdir3: TreeElement = new TreeElement("", "4", {}, "", "/src/subdir3", false);
        subdir3.parent = subDir;
        subDir.children.push(subdir3);

        underTest.optimizeDirectoryStructure(root);

        expect(root.children.length).to.be.eq(0);
    });
});

function createResponseWithComponents(components: SonarQubeApiComponent[]): SonarQubeMeasureResponse {
    return {
        baseComponent: {
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "",
            qualifier: SQ_QUALIFIER_DIRECTORY
        },
        components
    };
}