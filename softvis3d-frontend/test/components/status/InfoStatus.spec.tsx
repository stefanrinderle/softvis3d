import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import AppStatusStore from "../../../src/stores/AppStatusStore";
import StatusAction from "../../../src/classes/status/StatusAction";
import InfoStatus from "../../../src/components/status/InfoStatus";

describe("<InfoStatus/>", () => {

    it("should show status list single", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const expectedLoadMessage = "test";
        localAppStatusStore.status(new StatusAction("key", expectedLoadMessage));

        const loadingQueue = shallow(
            <InfoStatus appStatusStore={localAppStatusStore}/>
        );

        expect(loadingQueue.html()).to.include(expectedLoadMessage);
    });

    it("should show status list multi", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const expectedLoadMessage = "test";
        const expectedLoadMessage2 = "ioiio";
        localAppStatusStore.status(new StatusAction("key", expectedLoadMessage));
        localAppStatusStore.status(new StatusAction("key2", expectedLoadMessage2));

        const loadingQueue = shallow(
            <InfoStatus appStatusStore={localAppStatusStore}/>
        );

        expect(loadingQueue.html()).to.include(expectedLoadMessage);
        expect(loadingQueue.html()).to.include(expectedLoadMessage2);
    });

    it("should draw no list elements if not visible", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const loading = shallow(
            <InfoStatus appStatusStore={localAppStatusStore}/>
        );

        expect(loading.children().length).to.be.eq(0);
    });

});