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
    SonarQubeMeasureResponse
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
            qualifier: "DIR"
        }];
        let components2: SonarQubeApiComponent[] = [{
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/src/file.java",
            qualifier: "FIL"
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
            qualifier: "BRC"
        }];
        let components2: SonarQubeApiComponent[] = [{
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/",
            qualifier: "DIR"
        }, {
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/src",
            qualifier: "DIR"
        }];
        let components3: SonarQubeApiComponent[] = [{
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/src/file.java",
            qualifier: "FIL"
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
            qualifier: "DIR"
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
            qualifier: "BRC"
        }];
        let components2: SonarQubeApiComponent[] = [{
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/",
            qualifier: "DIR"
        }, {
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "/src",
            qualifier: "DIR"
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
     * removeEmptyDirectories tests
     */

    it("should remove an empty dir as root child", () => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();
        let measureApiService: any = Sinon.createStubInstance(SonarQubeMeasuresApiService);

        let underTest: SonarQubeMeasuresTreeService =
            new SonarQubeMeasuresTreeService(testAppStatusStore, measureApiService);

        let root: TreeElement = new TreeElement("", "", {}, "", "", false);
        let emptySubDir: TreeElement = new TreeElement("", "", {}, "", "", false);
        root.children.push(emptySubDir);

        underTest.removeEmptyDirectories(root);

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

        underTest.removeEmptyDirectories(root);

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

        underTest.removeEmptyDirectories(root);

        expect(root.children.length).to.be.eq(1);
        expect(root.children[0].children.length).to.be.eq(1);
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
            qualifier: "DIR"
        },
        components
    };
}