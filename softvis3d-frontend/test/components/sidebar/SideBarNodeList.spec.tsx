import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SideBarNodeList from "../../../src/components/sidebar/NodeList";
import SideBarElementInfo from "../../../src/components/sidebar/ElementInfo";
import { SceneStore } from "../../../src/stores/SceneStore";

describe("<NodeList/>", () => {

    it("should show siblings of the selected element as list", () => {
        let parent: TreeElement = createTestTreeElement("parent");
        let child1: TreeElement = createTestTreeElement("child1");
        let child2: TreeElement = createTestTreeElement("child2");

        parent.isNode = true;
        parent.children.push(child1);
        parent.children.push(child2);
        child1.parentId = parent.id;
        child2.parentId = parent.id;

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.legacyData = parent;

        const sideBarLeafInfo = shallow(
            <SideBarNodeList
                selectedElement={child1}
                sceneStore={localSceneStore}
            />
        );

        expect(sideBarLeafInfo.contains(
            <SideBarElementInfo
                element={child1}
                selected={true}
                sceneStore={localSceneStore}
            />
            )).to.be.true;

        expect(sideBarLeafInfo.contains(
            <SideBarElementInfo
                element={child2}
                sceneStore={localSceneStore}
            />
            )).to.be.true;
    });

    it("should show children of the selected element as list", () => {
        let root: TreeElement = createTestTreeElement("root");
        let child1: TreeElement = createTestTreeElement("child1");
        let child2: TreeElement = createTestTreeElement("child2");

        root.isNode = true;
        root.children.push(child1);
        root.children.push(child2);

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.legacyData = root;

        const selectedElementInfo = shallow(
            <SideBarNodeList
                selectedElement={root}
                sceneStore={localSceneStore}
            />
        );

        expect(selectedElementInfo.find("ul.node-list")).to.have.length(1);

        expect(selectedElementInfo.contains(
            <SideBarElementInfo
                element={child1}
                sceneStore={localSceneStore}/>)
        ).to.be.true;

        expect(selectedElementInfo.contains(
            <SideBarElementInfo
                element={child2}
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

        measures: {},
        parentId: null
    };
}