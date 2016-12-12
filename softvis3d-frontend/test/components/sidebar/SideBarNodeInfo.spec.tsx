import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import SideBarNodeInfo from "../../../src/components/sidebar/SideBarNodeInfo";
import {SceneStore} from "../../../src/stores/SceneStore";
import SideBarSingleElementInfo from "../../../src/components/sidebar/SideBarSingleElementInfo";

describe("<SideBarNodeInfo/>", () => {

    it("should show children as list", () => {
        let localSceneStore: SceneStore = new SceneStore();
        let selectedElement: TreeElement = createTestTreeElement("root");

        let firstChild: TreeElement = createTestTreeElement("child1");
        let secondChild: TreeElement = createTestTreeElement("child2");
        selectedElement.children.push(firstChild, secondChild);

        const selectedElementInfo = shallow(
            <SideBarNodeInfo selectedElement={selectedElement} sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.html().includes("<ul>")).to.be.true;
        expect(selectedElementInfo.contains(<SideBarSingleElementInfo element={firstChild}
                                                                      isCurrentSelectedElement={false}
                                                                      sceneStore={localSceneStore}/>)).to.be.true;
        expect(selectedElementInfo.contains(<SideBarSingleElementInfo element={secondChild}
                                                                      isCurrentSelectedElement={false}
                                                                      sceneStore={localSceneStore}/>)).to.be.true;
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