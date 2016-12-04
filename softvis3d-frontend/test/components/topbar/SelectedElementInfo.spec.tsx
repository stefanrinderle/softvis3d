import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import SelectedElementInfo from "../../../src/components/topbar/SelectedElementInfo";

describe("<SelectedElementInfo/>", () => {

    it("should show default text div on start", () => {
        const selectedElementInfo = shallow(
            <SelectedElementInfo/>
        );

        expect(selectedElementInfo.children().length).to.be.eq(1);
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
    //         <TopBar/>
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
    //         <TopBar/>
    //     );
    //
    //     expect(topbar.children().length).to.be.eq(1);
    // });

});