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
import * as Sinon from "sinon";
import AutoReloadService from "../../src/services/AutoReloadService";
import SonarQubeComponentInfoService from "../../src/services/sonarqube/SonarQubeComponentInfoService";
import { AppStatusStore } from "../../src/stores/AppStatusStore";

describe("AutoReloadService", () => {

    it("should start calling component info update", () => {
        let windowStub = Sinon.stub(window, "setInterval");

        const appStatusStore = Sinon.createStubInstance(AppStatusStore);
        const componentInfoService = Sinon.createStubInstance(SonarQubeComponentInfoService);
        let underTest = new AutoReloadService(appStatusStore, componentInfoService);

        underTest.startAutoReload();

        assert(windowStub.calledWithExactly(underTest.loadComponentInfo, AutoReloadService.RELOAD_INTERVAL_MS));

        windowStub.restore();
    });

    it("should clear interval on multiple starts", () => {
        let windowSetStub = Sinon.stub(window, "setInterval").returns(1);
        let windowClearStub = Sinon.stub(window, "clearInterval");

        const appStatusStore = Sinon.createStubInstance(AppStatusStore);
        const componentInfoService = Sinon.createStubInstance(SonarQubeComponentInfoService);
        let underTest = new AutoReloadService(appStatusStore, componentInfoService);

        underTest.startAutoReload();

        assert(windowSetStub.calledWithExactly(underTest.loadComponentInfo, AutoReloadService.RELOAD_INTERVAL_MS));
        expect(windowClearStub.called).to.be.false;

        underTest.startAutoReload();
        assert(windowSetStub.calledTwice);
        assert(windowClearStub.called);

        windowSetStub.restore();
        windowClearStub.restore();
    });

    it("should set active after start", () => {
        let windowStub = Sinon.stub(window, "setInterval").returns(1);

        const appStatusStore = Sinon.createStubInstance(AppStatusStore);
        const componentInfoService = Sinon.createStubInstance(SonarQubeComponentInfoService);

        let underTest = new AutoReloadService(appStatusStore, componentInfoService);

        expect(underTest.isActive()).to.be.false;

        underTest.startAutoReload();

        expect(underTest.isActive()).to.be.true;

        windowStub.restore();
    });

});
