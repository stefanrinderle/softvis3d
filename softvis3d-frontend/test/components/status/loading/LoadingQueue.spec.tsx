import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import LoadingQueue from "../../../../src/components/status/loading/LoadingQueue";
import AppStatusStore from "../../../../src/stores/AppStatusStore";
import LoadAction from "../../../../src/classes/status/LoadAction";

describe("<LoadingQueue/>", () => {

    it("should show loading list single", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const expectedLoadMessage = "test";
        localAppStatusStore.load(new LoadAction("key", expectedLoadMessage));

        const loadingQueue = shallow(
            <LoadingQueue appStatusStore={localAppStatusStore}/>
        );

        expect(loadingQueue.html()).to.include(expectedLoadMessage);
    });

    it("should show loading list single with status", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const expectedLoadMessage = "test";
        const action = new LoadAction("key", expectedLoadMessage);
        localAppStatusStore.load(action);

        const pageSize = 34;
        const limit = 98;
        localAppStatusStore.loadStatusUpdate(action.key, pageSize, limit);

        const loadingQueue = shallow(
            <LoadingQueue appStatusStore={localAppStatusStore}/>
        );

        expect(loadingQueue.html()).to.include(pageSize);
        expect(loadingQueue.html()).to.include(limit);
    });

    it("should show loading list multi", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const expectedLoadMessage = "test";
        const expectedLoadMessage2 = "ioiio";
        localAppStatusStore.load(new LoadAction("key", expectedLoadMessage));
        localAppStatusStore.load(new LoadAction("key2", expectedLoadMessage2));

        const loadingQueue = shallow(
            <LoadingQueue appStatusStore={localAppStatusStore}/>
        );

        expect(loadingQueue.html()).to.include(expectedLoadMessage);
        expect(loadingQueue.html()).to.include(expectedLoadMessage2);
    });

    it("should draw no list elements if not visible", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const loading = shallow(
            <LoadingQueue appStatusStore={localAppStatusStore}/>
        );

        expect(loading.children().length).to.be.eq(0);
    });

});