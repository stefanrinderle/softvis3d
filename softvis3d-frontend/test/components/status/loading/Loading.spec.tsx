import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import Loading from "../../../../src/components/status/loading/Loading";
import LoadingImage from "../../../../src/components/status/loading/LoadingImage";
import LoadingQueue from "../../../../src/components/status/loading/LoadingQueue";
import {AppStatusStore} from "../../../../src/stores/AppStatusStore";
import LoadAction from "../../../../src/classes/status/LoadAction";

describe("<Loading/>", () => {

    it("should draw loading components if loading", () => {
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        localAppStatusStore.load(new LoadAction("test", ""));

        const loading = shallow(
            <Loading appStatusStore={localAppStatusStore}/>
        );

        expect(loading.contains(<LoadingImage/>)).to.be.true;
        expect(loading.contains(<LoadingQueue appStatusStore={localAppStatusStore}/>)).to.be.true;
    });

    it("should draw nothing if not visible", () => {
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        const loading = shallow(
            <Loading appStatusStore={localAppStatusStore}/>
        );

        expect(loading.children().length).to.be.eq(0);
    });

});