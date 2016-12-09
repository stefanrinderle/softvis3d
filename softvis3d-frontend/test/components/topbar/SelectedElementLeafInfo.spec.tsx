import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import SelectedElementLeafInfo from "../../../src/components/topbar/SelectedElementLeafInfo";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";

describe("<SelectedElementLeafInfo/>", () => {

    it("should show title and metric", () => {
        let expectedHeightMetricValue: number = 321;
        let expectedFootprintMetricValue: number = 123;
        let expectedColorMetricValue: number = 222;

        let expectedName: string = "siduhfis";
        let selectedElement: TreeElement = createTestTreeElement(expectedName, expectedHeightMetricValue, expectedFootprintMetricValue, expectedColorMetricValue);
        selectedElement.children.push(createTestTreeElement(expectedName + "c", 0, 0, 0));

        let localCityBuilderStore = new CityBuilderStore();

        const selectedElementLeafInfo = shallow(
            <SelectedElementLeafInfo selectedElement={selectedElement} cityBuilderStore={localCityBuilderStore}/>
        );

        expect(selectedElementLeafInfo.html().includes(expectedName)).to.be.true;
        expect(selectedElementLeafInfo.html().includes(expectedHeightMetricValue + "")).to.be.true;
        expect(selectedElementLeafInfo.html().includes(expectedFootprintMetricValue + "")).to.be.true;
        expect(selectedElementLeafInfo.html().includes(expectedColorMetricValue + "")).to.be.true;
    });

});

function createTestTreeElement(name: string, expectedHeightMetricValue: number,
                               expectedFootprintMetricValue: number, expectedColorMetricValue: number): TreeElement {
    return {
        id: "",
        name,
        isNode: false,

        children: [],

        colorMetricValue: expectedColorMetricValue,
        footprintMetricValue: expectedFootprintMetricValue,
        heightMetricValue: expectedHeightMetricValue,
        parentInfo: null
    };
}