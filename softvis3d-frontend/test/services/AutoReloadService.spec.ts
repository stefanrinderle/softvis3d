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

import {assert, expect} from "chai";
import * as Sinon from "sinon";
import AutoReloadService from "../../src/services/AutoReloadService";
import SonarQubeComponentInfoService from "../../src/services/sonarqube/SonarQubeComponentInfoService";
import AppStatusStore from "../../src/stores/AppStatusStore";
import {createMock} from "../Helper";

describe("AutoReloadService", () => {

    it("should start calling component info update", () => {
        const windowStub = Sinon.stub(window, "setInterval");

        const appStatusStore = Sinon.createStubInstance(AppStatusStore);
        appStatusStore.analysisDate = new Date();

        createMock(SonarQubeComponentInfoService);
        const underTest = new AutoReloadService();

        underTest.startAutoReload(appStatusStore);

        assert(windowStub.called);

        windowStub.restore();
    });

    it("should not start component info update if analysisDate is undefined", () => {
        const windowStub = Sinon.stub(window, "setInterval");

        const appStatusStore = Sinon.createStubInstance(AppStatusStore);
        createMock(SonarQubeComponentInfoService);
        const underTest = new AutoReloadService();

        underTest.startAutoReload(appStatusStore);

        assert(windowStub.notCalled);

        windowStub.restore();
    });

    it("should clear interval on multiple starts", () => {
        const windowSetStub = Sinon.stub(window, "setInterval").returns(1);
        const windowClearStub = Sinon.stub(window, "clearInterval");

        const appStatusStore = Sinon.createStubInstance(AppStatusStore);
        appStatusStore.analysisDate = new Date();

        createMock(SonarQubeComponentInfoService);
        const underTest = new AutoReloadService();

        underTest.startAutoReload(appStatusStore);

        assert(windowSetStub.called);
        expect(windowClearStub.called).to.be.false;

        underTest.startAutoReload(appStatusStore);
        assert(windowSetStub.calledTwice);
        assert(windowClearStub.called);

        windowSetStub.restore();
        windowClearStub.restore();
    });

    it("should set active after start", () => {
        const windowStub = Sinon.stub(window, "setInterval").returns(1);

        const appStatusStore = Sinon.createStubInstance(AppStatusStore);
        appStatusStore.analysisDate = new Date();

        createMock(SonarQubeComponentInfoService);

        const underTest = new AutoReloadService();

        expect(underTest.isActive()).to.be.false;

        underTest.startAutoReload(appStatusStore);

        expect(underTest.isActive()).to.be.true;

        windowStub.restore();
    });

    it("should update analysis date in store if changed", (done) => {
        const clock = Sinon.useFakeTimers();

        const appStatusStore = Sinon.createStubInstance(AppStatusStore);
        appStatusStore.analysisDate = new Date();

        const expectedDate = new Date(0);

        const componentInfoService = createMock(SonarQubeComponentInfoService);
        componentInfoService.loadComponentInfo.returns(Promise.resolve({
            analysisDate: expectedDate
        }));
        const underTest = new AutoReloadService();

        underTest.updateAnalysisDate(appStatusStore);

        const returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            expect(appStatusStore.analysisDate.getTime()).to.eq(expectedDate.getTime());
            done();
        }).catch((error) => done(error));
    });

    it("should not update analysis date in store if not changed", (done) => {
        const clock = Sinon.useFakeTimers();

        const expectedDate = new Date(0);

        const appStatusStore = Sinon.createStubInstance(AppStatusStore);
        appStatusStore.analysisDate = expectedDate;

        const componentInfoService = createMock(SonarQubeComponentInfoService);
        componentInfoService.loadComponentInfo.returns(Promise.resolve({
            analysisDate: new Date(0)
        }));
        const underTest = new AutoReloadService();

        underTest.updateAnalysisDate(appStatusStore);

        const returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            expect(appStatusStore.analysisDate).to.eq(expectedDate);
            done();
        }).catch((error) => done(error));
    });

    it("should update analysis date in store if undefined before", (done) => {
        const clock = Sinon.useFakeTimers();

        const appStatusStore = Sinon.createStubInstance(AppStatusStore);
        const expectedDate = new Date(0);

        const componentInfoService = createMock(SonarQubeComponentInfoService);
        componentInfoService.loadComponentInfo.returns(Promise.resolve({
            analysisDate: expectedDate
        }));
        const underTest = new AutoReloadService();

        underTest.updateAnalysisDate(appStatusStore);

        const returnPromise: Promise<any> = Promise.resolve({});
        clock.tick(10);
        returnPromise.then(() => {
            expect(appStatusStore.analysisDate.getTime()).to.eq(expectedDate.getTime());
            done();
        }).catch((error) => done(error));
    });
});
