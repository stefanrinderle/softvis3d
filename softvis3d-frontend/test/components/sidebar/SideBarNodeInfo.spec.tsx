import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import SideBarNodeInfo from "../../../src/components/sidebar/SideBarNodeInfo";

describe("<SideBarNodeInfo/>", () => {

    it("should show children as list", () => {
        let selectedElement: TreeElement = createTestTreeElement("root");

        selectedElement.children.push(createTestTreeElement("child1"), createTestTreeElement("child2"));

        const selectedElementInfo = shallow(
            <SideBarNodeInfo selectedElement={selectedElement}/>
        );

        // TODO
        expect(selectedElementInfo.html().includes("<ul>")).to.be.true;
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