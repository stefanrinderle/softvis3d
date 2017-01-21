import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import LoadingQueue from "../../../../src/components/status/loading/LoadingQueue";
import {AppStatusStore} from "../../../../src/stores/AppStatusStore";

describe("<LoadingQueue/>", () => {

    it("should show loading list single", () => {
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        let expectedLoadMessage = "test";
        localAppStatusStore.load(expectedLoadMessage);

        const loadingQueue = shallow(
            <LoadingQueue appStatusStore={localAppStatusStore}/>
        );

        expect(loadingQueue.html()).to.include(expectedLoadMessage);
    });

    it("should show loading list multi", () => {
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        let expectedLoadMessage = "test";
        let expectedLoadMessage2 = "ioiio";
        localAppStatusStore.load(expectedLoadMessage);
        localAppStatusStore.load(expectedLoadMessage2);

        const loadingQueue = shallow(
            <LoadingQueue appStatusStore={localAppStatusStore}/>
        );

        expect(loadingQueue.html()).to.include(expectedLoadMessage);
        expect(loadingQueue.html()).to.include(expectedLoadMessage2);
    });

    it("should draw no list elements if not visible", () => {
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        const loading = shallow(
            <LoadingQueue appStatusStore={localAppStatusStore}/>
        );

        expect(loading.children().length).to.be.eq(0);
    });

});