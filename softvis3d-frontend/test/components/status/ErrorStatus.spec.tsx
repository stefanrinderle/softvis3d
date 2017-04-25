import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import ErrorStatus from "../../../src/components/status/ErrorStatus";
import {AppStatusStore} from "../../../src/stores/AppStatusStore";
import ErrorAction from "../../../src/classes/status/ErrorAction";

describe("<ErrorStatus/>", () => {

    it("should show loading list single", () => {
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        let expectedErrorMessage = "test";
        localAppStatusStore.error(new ErrorAction("key", expectedErrorMessage, "", () => undefined));

        const loadingQueue = shallow(
            <ErrorStatus appStatusStore={localAppStatusStore}/>
        );

        expect(loadingQueue.html()).to.include(expectedErrorMessage);
    });

    it("should show loading list multi", () => {
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        let expectedErrorMessage = "test";
        let expectedErrorMessage2 = "ioiio";
        localAppStatusStore.error(new ErrorAction("key", expectedErrorMessage, "", () => undefined));
        localAppStatusStore.error(new ErrorAction("key2", expectedErrorMessage2, "", () => undefined));

        const loadingQueue = shallow(
            <ErrorStatus appStatusStore={localAppStatusStore}/>
        );

        expect(loadingQueue.html()).to.include(expectedErrorMessage);
        expect(loadingQueue.html()).to.include(expectedErrorMessage2);
    });

    it("should draw no list elements if not visible", () => {
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        const loading = shallow(
            <ErrorStatus appStatusStore={localAppStatusStore}/>
        );

        expect(loading.children().length).to.be.eq(0);
    });

});