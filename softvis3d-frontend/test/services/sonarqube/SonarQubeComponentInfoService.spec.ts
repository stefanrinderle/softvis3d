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
import { assert, expect } from "chai";
import { AppStatusStore } from "../../../src/stores/AppStatusStore";
import * as Sinon from "sinon";
import SonarQubeComponentInfoService from "../../../src/services/sonarqube/SonarQubeComponentInfoService";

describe("SonarQubeComponentInfoService", () => {

    it("should call backend and return component info", (done) => {
        let testAppStatusStore: AppStatusStore = new AppStatusStore();

        let apiUrl: string = "urlsihshoif";
        let projectKey = "iuzsgdfus";
        let underTest: SonarQubeComponentInfoService = new SonarQubeComponentInfoService(projectKey, testAppStatusStore,
            apiUrl);

        let expectedId = "0844b558-2051-45a6-9970-e3f53fc86f09";
        let expectedKey = "de.rinderle.softvis3d:softvis3d";
        let expectedName = "softvis3d";

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.resolve({
                data: {
                    component: {
                        organization: "default-organization",
                        id: expectedId,
                        key: expectedKey,
                        name: expectedName,
                        qualifier: "TRK",
                        analysisDate: "2017-11-14T22:08:39+0100",
                        leakPeriodDate: "2017-08-15T16:23:51+0200",
                        version: "1.0.1-SNAPSHOT"
                    }
                }
            });
        });

        underTest.loadComponentInfo().then((result) => {
            // check result property is of type Date
            expect(result.analysisDate.getTime()).to.be.eq(1510693719000);

            expect(result.id).to.be.eq(expectedId);
            expect(result.key).to.be.eq(expectedKey);
            expect(result.name).to.be.eq(expectedName);

            done();
        }).catch((error) => {
            assert.isNotOk(error, "Promise error");
            done();
        });
    });

    it("should react on errors", (done) => {
        const testAppStatusStore = Sinon.createStubInstance(AppStatusStore);

        let apiUrl: string = "urlsihshoif";
        let projectKey = "iuzsgdfus";
        let underTest: SonarQubeComponentInfoService = new SonarQubeComponentInfoService(projectKey, testAppStatusStore,
            apiUrl);

        Sinon.stub(underTest, "callApi").callsFake(() => {
            return Promise.reject({
                response: {
                    statusText: "not working"
                }
            });
        });

        underTest.loadComponentInfo().then(() => {
            assert.isNotOk("Should go to catch clause instead of then");

            done();
        }).catch(() => {
            assert(testAppStatusStore.error.called);

            done();
        });
    });

});