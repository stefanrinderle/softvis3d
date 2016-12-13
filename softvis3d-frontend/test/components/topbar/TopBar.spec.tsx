import * as React from "react";
import TopBar from "../../../src/components/topbar/TopBar";
import { expect } from "chai";
import { shallow } from "enzyme";
import { CityBuilderStore } from "../../../src/stores/CityBuilderStore";
import TopBarMenu from "../../../src/components/topbar/TopBarMenu";
import SelectedElementInfo from "../../../src/components/topbar/SelectedElementInfo";

describe("<TopBar/>", () => {

    it("should show default text div on start", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let selectedElement: TreeElement = createTestTreeElement();

        const selectedElementInfo = shallow(
            <TopBar cityBuilderStore={localCityBuilderStore}
                    selectedElement={selectedElement}/>
        );

        expect(selectedElementInfo.contains(<SelectedElementInfo cityBuilderStore={localCityBuilderStore}
                                                                 selectedElement={selectedElement}/>)).to.be.true;
        expect(selectedElementInfo.contains(<TopBarMenu cityBuilderStore={localCityBuilderStore}/>)).to.be.true;
    });

});

function createTestTreeElement(): TreeElement {
    return {
        id: "",
        name: "",
        isNode: false,

        children: [],

        colorMetricValue: 0,
        footprintMetricValue: 0,
        heightMetricValue: 0,
        parentId: null
    };
}