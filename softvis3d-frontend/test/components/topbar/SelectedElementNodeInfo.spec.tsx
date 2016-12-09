import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import SelectedElementNodeInfo from "../../../src/components/topbar/SelectedElementNodeInfo";

describe("<SelectedElementNodeInfo/>", () => {

    it("should show title and metric", () => {
        let expectedName: string = "siduhfis";
        let selectedElement: TreeElement = createTestTreeElement(expectedName);
        selectedElement.children.push(createTestTreeElement(expectedName + "c"));

        const selectedElementNodeInfo = shallow(
            <SelectedElementNodeInfo selectedElement={selectedElement} />
        );

        expect(selectedElementNodeInfo.html().includes(expectedName)).to.be.true;
        // "1" is children length
        expect(selectedElementNodeInfo.html().includes("1")).to.be.true;
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