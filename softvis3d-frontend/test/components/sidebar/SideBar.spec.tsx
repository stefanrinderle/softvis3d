import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SideBar from "../../../src/components/sidebar/SideBar";
import FolderContent from "../../../src/components/sidebar/FolderContent";
import ParentElement from "../../../src/components/sidebar/ParentElement";
import { SceneStore } from "../../../src/stores/SceneStore";

describe("<SideBar/>", () => {

    it("should be empty, if no element is selected", () => {
        let localSceneStore = new SceneStore();

        const selectedElementInfo = shallow(
            <SideBar sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.true;
        expect(selectedElementInfo.find("ul")).to.have.length(0);
    });

    it("should show node info for nodes", () => {
        let parent1: TreeElement = createTestTreeElement();
        let parent0: TreeElement = createTestTreeElement();
        let child: TreeElement = createTestTreeElement();

        parent1.isNode = true;
        parent1.children.push(parent0);
        parent0.isNode = true;
        parent0.parentId = parent1.id;
        parent0.children.push(child);
        child.parentId = parent0.id;

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.legacyData = parent1;
        localSceneStore.selectedObjectId = parent0.id;

        const selectedElementInfo = shallow(
            <SideBar sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.true;

        expect(selectedElementInfo.contains(
            <ParentElement
                selectedElement={parent0}
                sceneStore={localSceneStore}/>
        )).to.be.true;

        expect(selectedElementInfo.contains(
            <FolderContent
                activeFolder={parent0}
                sceneStore={localSceneStore}
            />
        )).to.be.true;

        expect(selectedElementInfo.html()).to.contain(parent0.id);
        expect(selectedElementInfo.html()).to.contain(child.id);
    });

    it("should show node info for leafs", () => {
        let parent1: TreeElement = createTestTreeElement();
        let parent0: TreeElement = createTestTreeElement();
        let child: TreeElement = createTestTreeElement();

        parent1.isNode = true;
        parent1.children.push(parent0);
        parent0.isNode = true;
        parent0.parentId = parent1.id;
        parent0.children.push(child);
        child.parentId = parent0.id;

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.legacyData = parent1;
        localSceneStore.selectedObjectId = child.id;

        const selectedElementInfo = shallow(
            <SideBar sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.true;

        expect(selectedElementInfo.contains(
            <ParentElement
                selectedElement={child}
                sceneStore={localSceneStore}/>
        )).to.be.true;

        expect(selectedElementInfo.contains(
            <FolderContent
                activeFolder={child}
                sceneStore={localSceneStore}
            />
        )).to.be.true;

        expect(selectedElementInfo.html()).to.contain(parent0.id);
        expect(selectedElementInfo.html()).to.contain(child.id);
    });
});

function createTestTreeElement(): TreeElement {
    const id = Math.random() + "";
    return {
        id,
        name: id,
        isNode: false,

        children: [],

        measures: {},
        parentId: null
    };
}
