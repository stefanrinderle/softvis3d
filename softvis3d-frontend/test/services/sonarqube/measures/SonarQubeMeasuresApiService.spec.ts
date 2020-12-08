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
import { AppConfiguration } from "../../../../src/classes/AppConfiguration";
import {
    SonarQubeMeasurePagingResponse,
    SQ_QUALIFIER_DIRECTORY,
    SQ_QUALIFIER_FILE,
} from "../../../../src/services/sonarqube/measures/api/SonarQubeMeasureResponse";
import SonarQubeMeasuresApiService from "../../../../src/services/sonarqube/measures/api/SonarQubeMeasuresApiService";
import AppStatusStore from "../../../../src/stores/AppStatusStore";
import SonarQubeMeasuresService from "../../../../src/services/sonarqube/measures/SonarQubeMeasuresService";
import { createMockInjection } from "../../../Helper";

describe("SonarQubeMeasuresApiService", () => {
    it("should call backend and load measures", (done) => {
        const testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());
        const spyLoadStatusUpdate = Sinon.spy(testAppStatusStore, "loadStatusUpdate");

        const underTest: SonarQubeMeasuresApiService = new SonarQubeMeasuresApiService(
            testAppConfiguration
        );
        const data: SonarQubeMeasurePagingResponse = createResponseWithOneComponent(1, 500, 1);
        const stub = Sinon.stub(underTest, "callApi").resolves({
            data,
        });

        underTest
            .loadMeasures("baseKey", "ncloc,complexity,example")
            .then((result) => {
                assert(
                    spyLoadStatusUpdate.calledWith(SonarQubeMeasuresService.LOAD_MEASURES.key, 1, 1)
                );
                assert(stub.called);
                expect(result.components.length).to.be.eq(1);

                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });

    it("should load again if more results", (done) => {
        const testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        const testAppStatusStore: AppStatusStore = createMockInjection(new AppStatusStore());
        const spyLoadStatusUpdate = Sinon.spy(testAppStatusStore, "loadStatusUpdate");

        const underTest: SonarQubeMeasuresApiService = new SonarQubeMeasuresApiService(
            testAppConfiguration
        );

        const data1: SonarQubeMeasurePagingResponse = createResponseWithOneComponent(1, 500, 600);
        const data2: SonarQubeMeasurePagingResponse = createResponseWithOneComponent(2, 500, 600);

        const spyCallApi = Sinon.stub(underTest, "callApi");
        spyCallApi.onFirstCall().resolves({
            data: data1,
        });
        spyCallApi.onSecondCall().resolves({
            data: data2,
        });

        underTest
            .loadMeasures("baseKey", "ncloc,complexity,more")
            .then((result) => {
                assert(spyCallApi.called);
                expect(result.components.length).to.be.eq(2);
                assert(spyCallApi.calledTwice);

                assert(
                    spyLoadStatusUpdate.calledWith(SonarQubeMeasuresService.LOAD_MEASURES.key, 1, 1)
                );
                assert(
                    spyLoadStatusUpdate.calledWith(SonarQubeMeasuresService.LOAD_MEASURES.key, 2, 2)
                );
                assert(spyLoadStatusUpdate.calledTwice);

                done();
            })
            .catch((error) => {
                assert.isNotOk(error);
                done();
            });
    });

    it("should call backend and react on errors", (done) => {
        const statusText = "not working";

        const testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        createMockInjection(new AppStatusStore());

        const underTest: SonarQubeMeasuresApiService = new SonarQubeMeasuresApiService(
            testAppConfiguration
        );

        const expectedText = statusText;
        Sinon.stub(underTest, "callApi").rejects({
            response: {
                statusText: expectedText,
            },
        });

        underTest
            .loadMeasures("baseKey", "ncloc,complexity")
            .then(() => {
                assert.isNotOk("Promise error", "works but should throw exception");

                done();
            })
            .catch((error) => {
                expect(error.response.statusText).to.be.eq(expectedText);
                done();
            });
    });

    it("should call backend and react on errors on the second call", (done) => {
        const testAppConfiguration: AppConfiguration = Sinon.createStubInstance(AppConfiguration);
        createMockInjection(new AppStatusStore());

        const underTest: SonarQubeMeasuresApiService = new SonarQubeMeasuresApiService(
            testAppConfiguration
        );

        const data1: SonarQubeMeasurePagingResponse = createResponseWithOneComponent(1, 500, 600);

        const spyCallApi = Sinon.stub(underTest, "callApi");
        spyCallApi.onFirstCall().resolves({
            data: data1,
        });

        const statusText = "not working";
        spyCallApi.onSecondCall().returns(
            Promise.reject({
                response: {
                    statusText: statusText,
                },
            })
        );

        underTest
            .loadMeasures("baseKey", "ncloc,complexity")
            // eslint-disable-next-line sonarjs/no-identical-functions
            .then(() => {
                assert.isNotOk("Promise error", "works but should throw exception");

                done();
            })
            .catch((error) => {
                expect(error.response.statusText).to.be.eq(statusText);

                done();
            });
    });
});

function createResponseWithOneComponent(
    pageIndex: number,
    pageSize: number,
    total: number
): SonarQubeMeasurePagingResponse {
    return {
        baseComponent: {
            id: "" + pageIndex,
            key: "" + pageIndex,
            measures: [],
            name: "" + pageIndex,
            path: "" + pageIndex,
            qualifier: SQ_QUALIFIER_DIRECTORY,
        },
        components: [
            {
                id: "expectedId" + pageIndex,
                key: "key" + pageIndex,
                measures: [],
                name: "name" + pageIndex,
                path: "path" + pageIndex,
                qualifier: SQ_QUALIFIER_FILE,
            },
        ],
        paging: {
            pageIndex,
            pageSize,
            total,
        },
    };
}
