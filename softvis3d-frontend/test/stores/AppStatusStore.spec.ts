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
import {AppStatusStore} from "../../src/stores/AppStatusStore";
import LoadAction from "../../src/classes/status/LoadAction";
import ErrorAction from "../../src/classes/status/ErrorAction";
import StatusAction from "../../src/classes/status/StatusAction";

describe("AppStatusStore", () => {

    it("should have set all default values on init", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        expect(underTest.loadingQueue.isEmpty).to.be.true;
        expect(underTest.loadingQueue.isEmpty).to.be.true;
        expect(underTest.errors.isEmpty).to.be.true;
        expect(underTest.showLoadingQueue).to.be.eq(false);
        expect(underTest.analysisDate).to.be.undefined;
    });

    it("should return isVisible false", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        expect(underTest.isVisible).to.be.equal(false);
    });

    it("should return isVisible true if loading queue has element", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        underTest.load(new LoadAction("key", "testEvent"));
        expect(underTest.isVisible).to.be.equal(true);
    });

    it("should return isVisible false after loading is complete", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        let testAction = new LoadAction("key", "testEvent");
        underTest.load(testAction);
        underTest.loadComplete(testAction);
        expect(underTest.isVisible).to.be.equal(false);
    });

    it("should return isVisible false after loading is complete with multiple events", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        let testAction = new LoadAction("key", "testEvent");
        let testAction2 = new LoadAction("key2", "testEvent");

        underTest.load(testAction);
        underTest.load(testAction2);
        underTest.loadComplete(testAction);
        expect(underTest.isVisible).to.be.equal(true);
        underTest.loadComplete(testAction2);
        expect(underTest.isVisible).to.be.equal(false);
    });

    it("should return isVisible true if errors has element", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        underTest.error(new ErrorAction("key", "testError", "", () => undefined));
        expect(underTest.isVisible).to.be.equal(true);
    });

    it("should return isVisible true after error is acknowledged", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        underTest.error(new ErrorAction("key", "testError", "", () => undefined));
        underTest.acknowledgeError(new ErrorAction("key", "testError", "", () => undefined));
        expect(underTest.isVisible).to.be.equal(false);
    });

    it("should return isVisible true if status has element", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        underTest.status(new StatusAction("key", "testError"));
        expect(underTest.isVisible).to.be.equal(true);
    });

    it("should return isVisible true after status is removed", () => {
        let underTest: AppStatusStore = new AppStatusStore();
        underTest.status(new StatusAction("key", "testError"));
        underTest.removeStatus(new StatusAction("key", "testError"));
        expect(underTest.isVisible).to.be.equal(false);
    });

    it("should create new instance of loading queue on status update", () => {
        let underTest: AppStatusStore = new AppStatusStore();

        let temp = underTest.loadingQueue;
        underTest.load(new LoadAction("key", "testEvent"));

        assert(underTest.loadingQueue === temp);

        temp = underTest.loadingQueue;
        underTest.loadStatusUpdate("key", 3, 4);

        assert(underTest.loadingQueue !== temp);
    });

    it("should be able to increment max status and current", () => {
        let underTest: AppStatusStore = new AppStatusStore();

        underTest.load(new LoadAction("key", "testEvent"));
        underTest.loadStatusUpdate("key", 1, 6);
        underTest.loadStatusUpdateIncrementCurrent("key");
        underTest.loadStatusUpdateIncrementMax("key");

        let resultAction = underTest.loadingQueue.getAction("key");
        expect(resultAction).not.to.be.undefined;
        if (resultAction) {
            expect(resultAction.current).not.to.be.undefined;
            assert(resultAction.current === 7);
            assert(resultAction.max === 2);
        } else {
            assert.notOk("This should not happen. Action not found");
        }
    });
});