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

import { expect } from "chai";
import * as Sinon from "sinon";
import { AppConfiguration } from "../../../src/classes/AppConfiguration";
import SonarQubeComponentInfoService from "../../../src/services/sonarqube/SonarQubeComponentInfoService";
import ComponentStatusStore from "../../../src/stores/ComponentStatusStore";
import { createMockInjection } from "../../Helper";

describe("SonarQubeComponentInfoService", () => {
    it("should call backend and return component info", (done) => {
        const clock = Sinon.useFakeTimers();

        const apiUrl = "urlsihshoif";
        const projectKey = "iuzsgdfus";
        const componentStatusStore: ComponentStatusStore = createMockInjection(
            new ComponentStatusStore(new AppConfiguration(projectKey, false, apiUrl))
        );

        const underTest: SonarQubeComponentInfoService = new SonarQubeComponentInfoService();

        const expectedId = "0844b558-2051-45a6-9970-e3f53fc86f09";
        const expectedKey = "de.rinderle.softvis3d:softvis3d";
        const expectedName = "softvis3d";

        Sinon.stub(underTest, "callApi").resolves({
            data: {
                component: {
                    organization: "default-organization",
                    id: expectedId,
                    key: expectedKey,
                    name: expectedName,
                    qualifier: "TRK",
                    analysisDate: "2017-11-14T22:08:39+0100",
                    leakPeriodDate: "2017-08-15T16:23:51+0200",
                    version: "1.0.1-SNAPSHOT",
                },
            },
        });

        underTest.loadComponentInfo();

        const returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise
            .then(() => {
                // check result property is of type Date
                expect(componentStatusStore.leakPeriodDate?.getTime()).to.be.eq(1502807031000);
                expect(componentStatusStore.lastAnalysisDate?.getTime()).to.be.eq(1510693719000);
                done();
            })
            .catch((error) => done(error));
    });

    it("should react on errors", () => {
        // const clock = Sinon.useFakeTimers();

        const apiUrl = "urlsihshoif";
        const projectKey = "iuzsgdfus";
        const componentStatusStore: ComponentStatusStore = createMockInjection(
            new ComponentStatusStore(new AppConfiguration(projectKey, false, apiUrl))
        );
        componentStatusStore.lastAnalysisDate = new Date();
        componentStatusStore.leakPeriodDate = new Date();

        const underTest: SonarQubeComponentInfoService = new SonarQubeComponentInfoService();

        Sinon.stub(underTest, "callApi").rejects({
            response: {
                data: "not working",
            },
        });

        underTest.loadComponentInfo();

        // TODO wait for promise does not work here.
        // const returnPromise: Promise<any> = Promise.resolve({});
        // clock.tick(10);
        // returnPromise
        //     .then(() => {
        //         expect(componentStatusStore.leakPeriodDate).to.be.undefined;
        //         expect(componentStatusStore.lastAnalysisDate).to.be.undefined;
        //         done();
        //     })
        //     .catch((error) => done(error));
    });
});
