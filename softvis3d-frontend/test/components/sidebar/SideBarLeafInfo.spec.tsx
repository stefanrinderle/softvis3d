import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SideBarLeafInfo from "../../../src/components/sidebar/SideBarLeafInfo";
import SideBarSingleElementInfo from "../../../src/components/sidebar/SideBarSingleElementInfo";
import { SceneStore } from "../../../src/stores/SceneStore";

describe("<SideBarLeafInfo/>", () => {

    it("should show children as list", () => {
        let localSceneStore: SceneStore = new SceneStore();

        let selectedElement: TreeElement = createTestTreeElement("child1");
        let secondChildElement: TreeElement = createTestTreeElement("child2");

        let parentElement: TreeElement = createTestTreeElement("parent");

        parentElement.children.push(selectedElement);
        parentElement.children.push(secondChildElement);

        const sideBarLeafInfo = shallow(
            <SideBarLeafInfo selectedElement={selectedElement} parentElement={parentElement}
                             sceneStore={localSceneStore}/>
        );

        expect(sideBarLeafInfo.contains(<SideBarSingleElementInfo element={selectedElement}
                                                                      isCurrentSelectedElement={true}
                                                                      sceneStore={localSceneStore}/>)).to.be.true;
        expect(sideBarLeafInfo.contains(<SideBarSingleElementInfo element={secondChildElement}
                                                                      isCurrentSelectedElement={false}
                                                                      sceneStore={localSceneStore}/>)).to.be.true;
    });

});

function createTestTreeElement(name: string): TreeElement {
    return {
        id: name,
        name,
        isNode: false,

        children: [],

        colorMetricValue: 0,
        footprintMetricValue: 0,
        heightMetricValue: 0,
        parentId: null
    };
}