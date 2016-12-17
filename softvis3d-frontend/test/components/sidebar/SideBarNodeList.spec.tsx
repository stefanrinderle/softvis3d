import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SideBarNodeList from "../../../src/components/sidebar/SideBarNodeList";
import SideBarElementInfo from "../../../src/components/sidebar/SideBarElementInfo";
import {SceneStore} from "../../../src/stores/SceneStore";

describe("<SideBarNodeList/>", () => {

    it("should show siblings of the selected element as list", () => {
        let localSceneStore: SceneStore = new SceneStore();

        let parentElement: TreeElement = createTestTreeElement("parent");
        let firstElement: TreeElement = createTestTreeElement("child1");
        let secondChildElement: TreeElement = createTestTreeElement("child2");

        parentElement.isNode = true;
        parentElement.children.push(firstElement);
        parentElement.children.push(secondChildElement);

        const sideBarLeafInfo = shallow(
            <SideBarNodeList
                selectedElement={firstElement}
                parentElement={parentElement}
                sceneStore={localSceneStore}
            />
        );

        expect(sideBarLeafInfo.contains(
            <SideBarElementInfo
                element={firstElement}
                isSelected={true}
                sceneStore={localSceneStore}
            />
            )).to.be.true;

        expect(sideBarLeafInfo.contains(
            <SideBarElementInfo
                element={secondChildElement}
                isSelected={false}
                sceneStore={localSceneStore}
            />
            )).to.be.true;
    });

    it("should show children of the selected element as list", () => {
        let localSceneStore: SceneStore = new SceneStore();

        let parentElement: TreeElement = createTestTreeElement("root");
        let firstChild: TreeElement = createTestTreeElement("child1");
        let secondChild: TreeElement = createTestTreeElement("child2");

        parentElement.isNode = true;
        parentElement.children.push(firstChild);
        parentElement.children.push(secondChild);

        const selectedElementInfo = shallow(
            <SideBarNodeList
                selectedElement={parentElement}
                parentElement={null}
                sceneStore={localSceneStore}
            />
        );

        expect(selectedElementInfo.find("ul.node-list")).to.have.length(1);

        expect(selectedElementInfo.contains(
            <SideBarElementInfo
                element={firstChild}
                isSelected={false}
                sceneStore={localSceneStore}/>)
        ).to.be.true;

        expect(selectedElementInfo.contains(
            <SideBarElementInfo
                element={secondChild}
                isSelected={false}
                sceneStore={localSceneStore}/>)
        ).to.be.true;
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