import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SelectedElementInfo from "../../../src/components/topbar/SelectedElementInfo";
import { CityBuilderStore } from "../../../src/stores/CityBuilderStore";
import SelectedElementNodeInfo from "../../../src/components/topbar/SelectedElementNodeInfo";
import SelectedElementLeafInfo from "../../../src/components/topbar/SelectedElementLeafInfo";

describe("<SelectedElementInfo/>", () => {

    it("should show default text div on start", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        const selectedElementInfo = shallow(
            <SelectedElementInfo cityBuilderStore={localCityBuilderStore} selectedElement={null}/>
        );

        expect(selectedElementInfo.html().includes("Select an object to see the details here")).to.be.true;
    });

    it("should node element if node details are requested", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        let testId: string = "siudgffsiuhdsfiu2332";
        let selectedElement: TreeElement = createTestTreeElement(testId);
        selectedElement.isNode = true;

        const selectedElementInfo = shallow(
            <SelectedElementInfo cityBuilderStore={localCityBuilderStore} selectedElement={selectedElement}/>
        );

        expect(selectedElementInfo.contains(<SelectedElementNodeInfo selectedElement={selectedElement}/>))
            .to.be.true;
    });

    it("should leaf element if node details are requested", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        let testId: string = "siudgffsiuhdsfiu2332";
        let selectedElement: TreeElement = createTestTreeElement(testId);

        const selectedElementInfo = shallow(
            <SelectedElementInfo cityBuilderStore={localCityBuilderStore} selectedElement={selectedElement}/>
        );

        expect(selectedElementInfo.contains(<SelectedElementLeafInfo selectedElement={selectedElement}
                                                                     cityBuilderStore={localCityBuilderStore}/>))
            .to.be.true;
    });
});

function createTestTreeElement(id: string): TreeElement {
    return {
        id,
        name: "",
        isNode: false,

        children: [],

        colorMetricValue: 0,
        footprintMetricValue: 0,
        heightMetricValue: 0,
        parentId: null
    };
}