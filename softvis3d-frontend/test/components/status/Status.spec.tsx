import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {AppStatusStore} from "../../../src/stores/AppStatusStore";
import Status from "../../../src/components/status/Status";
import SoftVis3DLogo from "../../../src/components/status/SoftVis3DLogo";
import Loading from "../../../src/components/status/loading/Loading";
import ErrorStatus from "../../../src/components/status/ErrorStatus";

describe("<Status/>", () => {

    it("should draw loading components if loading", () => {
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        localAppStatusStore.load("test");

        const softvis3d = shallow(
            <Status appStatusStore={localAppStatusStore}/>
        );

        expect(softvis3d.contains(<SoftVis3DLogo/>)).to.be.true;
        expect(softvis3d.contains(<Loading appStatusStore={localAppStatusStore}/>)).to.be.true;
        expect(softvis3d.contains(<ErrorStatus appStatusStore={localAppStatusStore}/>)).to.be.true;
    });

    it("should draw error components if errors", () => {
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        localAppStatusStore.error("test");

        const softvis3d = shallow(
            <Status appStatusStore={localAppStatusStore}/>
        );

        expect(softvis3d.contains(<SoftVis3DLogo/>)).to.be.true;
        expect(softvis3d.contains(<Loading appStatusStore={localAppStatusStore}/>)).to.be.true;
        expect(softvis3d.contains(<ErrorStatus appStatusStore={localAppStatusStore}/>)).to.be.true;
    });

    it("should draw nothing if not visible", () => {
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        const softvis3d = shallow(
            <Status appStatusStore={localAppStatusStore}/>
        );

        expect(softvis3d.children().length).to.be.eq(0);
    });


});