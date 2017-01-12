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
import {expect} from "chai";
import {AppStatusStore} from "../../src/stores/AppStatusStore";

describe("AppStatusStore", () => {

    it("should have set all default values on init", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        expect(underTest.loadingQueue.length).to.be.eq(0);
        expect(underTest.errors.length).to.be.eq(0);
        expect(underTest.showLoadingQueue).to.be.eq(false);

    });

    it("should return isVisible false", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        expect(underTest.isVisible).to.be.equal(false);
    });

    it("should return isVisible true if loading queue has element", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        underTest.load("testEvent");
        expect(underTest.isVisible).to.be.equal(true);
    });

    it("should return isVisible false after loading is complete", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        underTest.load("testEvent");
        underTest.loadComplete("testEvent");
        expect(underTest.isVisible).to.be.equal(false);
    });

    it("should return isVisible false after loading is complete with multiple events", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        underTest.load("testEvent");
        underTest.load("testEvent2");
        underTest.loadComplete("testEvent");
        expect(underTest.isVisible).to.be.equal(true);
        underTest.loadComplete("testEvent2");
        expect(underTest.isVisible).to.be.equal(false);
    });

    it("should return isVisible true if errors has element", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        underTest.error("testError");
        expect(underTest.isVisible).to.be.equal(true);
    });

    it("should return isVisible true after error is acknowledged", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        underTest.error("testError");
        underTest.acknowledgeError("testError");
        expect(underTest.isVisible).to.be.equal(false);
    });

});