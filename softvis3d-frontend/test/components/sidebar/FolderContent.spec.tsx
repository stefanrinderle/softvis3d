import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { SceneStore } from "../../../src/stores/SceneStore";
import FolderContentElement from "../../../src/components/sidebar/FolderContentElement";
import FolderContent from "../../../src/components/sidebar/FolderContent";

describe("<FolderContent/>", () => {

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
        localSceneStore.selectedObjectId = child1.id;

        const sideBarLeafInfo = shallow(
            <FolderContent
                activeFolder={parent}
                sceneStore={localSceneStore}
            />
        );

        expect(sideBarLeafInfo.contains(
            <FolderContentElement
                element={child1}
                isSelected={true}
                sceneStore={localSceneStore}
            />
            )).to.be.true;

        expect(sideBarLeafInfo.contains(
            <FolderContentElement
                element={child2}
                isSelected={false}
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
            <FolderContent
                activeFolder={root}
                sceneStore={localSceneStore}
            />
        );

        expect(selectedElementInfo.find("ul.node-list")).to.have.length(1);

        expect(selectedElementInfo.contains(
            <FolderContentElement
                element={child1}
                isSelected={false}
                sceneStore={localSceneStore}/>)
        ).to.be.true;

        expect(selectedElementInfo.contains(
            <FolderContentElement
                element={child2}
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

        measures: {},
        parentId: null
    };
}