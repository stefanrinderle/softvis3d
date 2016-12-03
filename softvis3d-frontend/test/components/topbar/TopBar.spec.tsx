import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import TopBarComponent from "../../../src/components/topbar/TopBar";

describe("<TopBarComponent/>", () => {

    it("should show nothing on start", () => {
        const topbar = shallow(
            <TopBarComponent/>
        );

        expect(topbar.children().length).to.be.eq(0);
    });

    // TODO: Changes of the stores here have side effects on other tests.
    // We should find a way to solve this. How can the sores be mocked?

    // it("should show nothing if element not found", () => {
    //     sceneStore.legacyData = {
    //         id: "XXX"
    //     };
    //     sceneStore.selectedObjectId = "AAA";
    //
    //     const topbar = shallow(
    //         <TopBarComponent/>
    //     );
    //
    //     expect(topbar.children().length).to.be.eq(0);
    // });
    //
    // it("should show something if element found", () => {
    //
    //     sceneStore.legacyData = {
    //         id: "XXX"
    //     };
    //     sceneStore.selectedObjectId = "XXX";
    //
    //     const topbar = shallow(
    //         <TopBarComponent/>
    //     );
    //
    //     expect(topbar.children().length).to.be.eq(1);
    // });

});