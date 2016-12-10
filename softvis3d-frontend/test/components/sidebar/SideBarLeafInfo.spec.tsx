import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import SideBarLeafInfo from "../../../src/components/sidebar/SideBarLeafInfo";

describe("<SideBarLeafInfo/>", () => {

    it("should show children as list", () => {
        let selectedElement: TreeElement = createTestTreeElement("root");

        const selectedElementInfo = shallow(
            <SideBarLeafInfo selectedElement={selectedElement}/>
        );

        // TODO
        expect(selectedElementInfo.html().length > 0).to.be.true;
        // expect(selectedElementInfo.html().includes("child1")).to.be.true;
        // expect(selectedElementInfo.html().includes("child2")).to.be.true;
    });

});

function createTestTreeElement(name: string): TreeElement {
    return {
        id: "",
        name,
        isNode: false,

        children: [],

        colorMetricValue: 0,
        footprintMetricValue: 0,
        heightMetricValue: 0,
        parentInfo: null
    };
}