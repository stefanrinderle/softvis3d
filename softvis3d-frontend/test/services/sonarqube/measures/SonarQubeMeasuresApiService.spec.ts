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
    SonarQubeMeasurePagingResponse,
    SQ_QUALIFIER_DIRECTORY, SQ_QUALIFIER_FILE
} from "../../../../src/services/sonarqube/measures/SonarQubeMeasureResponse";
import {AppConfiguration} from "../../../../src/classes/AppConfiguration";

describe("SonarQubeMeasuresApiService", () => {

    it("should call backend and load measures", (done) => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);

        let underTest: SonarQubeMeasuresApiService = new SonarQubeMeasuresApiService(testAppConfiguration);
        let data: SonarQubeMeasurePagingResponse = createResponseWithOneComponent(1, 500, 1);
        let stub = Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.resolve({
                data
            });
        });

        underTest.loadMeasures("baseKey", "ncloc,complexity", "children", [SQ_QUALIFIER_DIRECTORY]).then((result) => {
            assert(stub.called);
            expect(result.components.length).to.be.eq(1);

            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should load again if more results", (done) => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);

        let underTest: SonarQubeMeasuresApiService = new SonarQubeMeasuresApiService(testAppConfiguration);

        let data1: SonarQubeMeasurePagingResponse = createResponseWithOneComponent(1, 500, 600);
        let data2: SonarQubeMeasurePagingResponse = createResponseWithOneComponent(2, 500, 600);

        let spyCallApi = Sinon.stub(underTest, "callApi");
        spyCallApi.onFirstCall().returns(
            Promise.resolve({
                data: data1
            }));
        spyCallApi.onSecondCall().returns(
            Promise.resolve({
                data: data2
            }));

        underTest.loadMeasures("baseKey", "ncloc,complexity", "children", [SQ_QUALIFIER_DIRECTORY]).then((result) => {
            assert(spyCallApi.called);
            expect(result.components.length).to.be.eq(2);
            assert(spyCallApi.calledTwice);

            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should call backend and react on errors", (done) => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);

        let underTest: SonarQubeMeasuresApiService = new SonarQubeMeasuresApiService(testAppConfiguration);

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.reject({
                response: {
                    statusText: "not working"
                }
            });
        });

        underTest.loadMeasures("baseKey", "ncloc,complexity", "children", [SQ_QUALIFIER_DIRECTORY]).then(() => {
            assert.isNotOk("Promise error", "works but should throw exception");

            done();
        }).catch((error) => {
            expect(error.response.statusText).to.be.eq("not working");
            done();
        });
    });

    it("should call backend and react on errors on the second call", (done) => {
        let testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);

        let underTest: SonarQubeMeasuresApiService = new SonarQubeMeasuresApiService(testAppConfiguration);

        let data1: SonarQubeMeasurePagingResponse = createResponseWithOneComponent(1, 500, 600);

        let spyCallApi = Sinon.stub(underTest, "callApi");
        spyCallApi.onFirstCall().returns(
            Promise.resolve({
                data: data1
            }));

        spyCallApi.onSecondCall().returns(
            Promise.reject({
                response: {
                    statusText: "not working"
                }
            }));

        underTest.loadMeasures("baseKey", "ncloc,complexity", "children", [SQ_QUALIFIER_DIRECTORY]).then(() => {
            assert.isNotOk("Promise error", "works but should throw exception");

            done();
        }).catch((error) => {
            expect(error.response.statusText).to.be.eq("not working");

            done();
        });
    });
});

function createResponseWithOneComponent(pageIndex: number, pageSize: number,
                                        total: number): SonarQubeMeasurePagingResponse {
    return {
        baseComponent: {
            id: "" + pageIndex,
            key: "" + pageIndex,
            measures: [],
            name: "" + pageIndex,
            path: "" + pageIndex,
            qualifier: SQ_QUALIFIER_DIRECTORY
        },
        components: [{
            id: "expectedId" + pageIndex,
            key: "key" + pageIndex,
            measures: [],
            name: "name" + pageIndex,
            path: "path" + pageIndex,
            qualifier: SQ_QUALIFIER_FILE
        }],
        paging: {
            pageIndex,
            pageSize,
            total
        }
    };
}