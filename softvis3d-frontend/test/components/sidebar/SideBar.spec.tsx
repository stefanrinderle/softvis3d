import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SideBar from "../../../src/components/sidebar/SideBar";
import SideBarNodeList from "../../../src/components/sidebar/SideBarNodeList";
import SideBarSelectParent from "../../../src/components/sidebar/SideBarSelectParent";
import { SceneStore } from "../../../src/stores/SceneStore";

describe("<SideBar/>", () => {

    it("should show nothing if nothing selected", () => {
        let localSceneStore = new SceneStore();

        const selectedElementInfo = shallow(
            <SideBar selectedElement={null} sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.false;
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

        const selectedElementInfo = shallow(
            <SideBar selectedElement={parent0} sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.true;

        expect(selectedElementInfo.contains(
            <SideBarSelectParent
                selectedElement={parent0}
                sceneStore={localSceneStore}/>
        )).to.be.true;

        expect(selectedElementInfo.contains(
            <SideBarNodeList
                selectedElement={parent0}
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

        const selectedElementInfo = shallow(
            <SideBar selectedElement={child} sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.true;

        expect(selectedElementInfo.contains(
            <SideBarSelectParent
                selectedElement={child}
                sceneStore={localSceneStore}/>
        )).to.be.true;

        expect(selectedElementInfo.contains(
            <SideBarNodeList
                selectedElement={child}
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

        colorMetricValue: 0,
        footprintMetricValue: 0,
        heightMetricValue: 0,
        parentId: null
    };
}