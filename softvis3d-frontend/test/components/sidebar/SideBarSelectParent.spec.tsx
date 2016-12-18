import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SideBarSelectParent from "../../../src/components/sidebar/SelectParent";
import { SceneStore } from "../../../src/stores/SceneStore";

describe("<SelectParent/>", () => {

    it("should show nothing if selected Element has no parent", () => {
        const element = createTestTreeElement("root");
        let localSceneStore = new SceneStore();
        localSceneStore.legacyData = element;

        let sideBarSelectParent = shallow(
            <SideBarSelectParent sceneStore={localSceneStore} selectedElement={element}/>
        );

        expect(sideBarSelectParent.children().length).to.be.eq(0);
    });

    it("should show nothing if the parent of selected element is root", () => {
        let root: TreeElement = createTestTreeElement("root");
        let myElement: TreeElement = createTestTreeElement("parentElement234");

        root.isNode = true;
        root.children.push(myElement);
        myElement.parentId = root.id;

        let localSceneStore = new SceneStore();
        localSceneStore.legacyData = root;

        let sideBarSelectParent = shallow(
            <SideBarSelectParent sceneStore={localSceneStore} selectedElement={root}/>
        );

        expect(sideBarSelectParent.children()).to.have.length(0);
    });

    it("should select parent folder on click (for node element)", () => {
        let parent1: TreeElement = createTestTreeElement("parent1");
        let parent0: TreeElement = createTestTreeElement("parent0");
        let child: TreeElement = createTestTreeElement("child");

        parent1.isNode = true;
        parent1.children.push(parent0);
        parent0.isNode = true;
        parent0.parentId = parent1.id;
        parent0.children.push(child);
        child.parentId = parent0.id;

        let localSceneStore = new SceneStore();
        localSceneStore.legacyData = parent1;

        let sideBarSelectParent = shallow(
            <SideBarSelectParent sceneStore={localSceneStore} selectedElement={parent0}/>
        );

        sideBarSelectParent.find("a").simulate("click");
        expect(localSceneStore.selectedObjectId).to.be.eq("parent1");
    });

    it("should select parent folder on click (for leaf element)", () => {
        let parent1: TreeElement = createTestTreeElement("parent1");
        let parent0: TreeElement = createTestTreeElement("parent0");
        let child = createTestTreeElement("child");

        parent1.isNode = true;
        parent1.children.push(parent0);
        parent0.isNode = true;
        parent0.parentId = parent1.id;
        parent0.children.push(child);
        child.parentId = parent0.id;

        let localSceneStore = new SceneStore();
        localSceneStore.legacyData = parent1;

        let sideBarSelectParent = shallow(
            <SideBarSelectParent sceneStore={localSceneStore} selectedElement={child}/>
        );

        sideBarSelectParent.find("a").simulate("click");
        expect(localSceneStore.selectedObjectId).to.be.eq("parent1");
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