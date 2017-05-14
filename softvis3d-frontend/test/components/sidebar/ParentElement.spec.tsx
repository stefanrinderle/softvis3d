import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { SceneStore } from "../../../src/stores/SceneStore";
import ParentElement from "../../../src/components/sidebar/ParentElement";
import {TreeElement} from "../../../src/classes/TreeElement";

describe("<ParentElement/>", () => {

    it("should show nothing if selected Element has no parent", () => {
        const element = new TreeElement("parent", "parent", {}, "", "", false);
        let localSceneStore = new SceneStore();
        localSceneStore.projectData = element;

        let sideBarSelectParent = shallow(
            <ParentElement sceneStore={localSceneStore} selectedElement={element}/>
        );

        expect(sideBarSelectParent.children().length).to.be.eq(0);
    });

    it("should show nothing if the parent of selected element is root", () => {
        let parent: TreeElement = new TreeElement("parent", "parent", {}, "", "", false);
        let child1: TreeElement = new TreeElement("child1", "child1", {}, "", "", true, parent);

        parent.children.push(child1);

        let localSceneStore = new SceneStore();
        localSceneStore.projectData = parent;

        let sideBarSelectParent = shallow(
            <ParentElement sceneStore={localSceneStore} selectedElement={parent}/>
        );

        expect(sideBarSelectParent.children()).to.have.length(0);
    });

    it("should select parent folder on click (for node element)", () => {
        let parent: TreeElement = new TreeElement("parent", "parent", {}, "", "", false);
        let child1: TreeElement = new TreeElement("child1", "child1", {}, "", "", false, parent);
        let child11: TreeElement = new TreeElement("child11", "child11", {}, "", "", true, parent);

        parent.children.push(child1);
        child1.children.push(child11);

        let localSceneStore = new SceneStore();
        localSceneStore.projectData = parent;

        let sideBarSelectParent = shallow(
            <ParentElement sceneStore={localSceneStore} selectedElement={child1}/>
        );

        sideBarSelectParent.find(".select-parent span").simulate("click");
        expect(localSceneStore.selectedObjectId).to.be.eq("parent");
    });

    it("should select parent folder on click (for leaf element)", () => {
        let parent: TreeElement = new TreeElement("parent", "parent", {}, "", "", false);
        let child1: TreeElement = new TreeElement("child1", "child1", {}, "", "", false, parent);
        let child11: TreeElement = new TreeElement("child11", "child11", {}, "", "", true, child1);

        parent.children.push(child1);
        child1.children.push(child11);

        let localSceneStore = new SceneStore();
        localSceneStore.projectData = parent;

        let sideBarSelectParent = shallow(
            <ParentElement sceneStore={localSceneStore} selectedElement={child11}/>
        );

        sideBarSelectParent.find(".select-parent span").simulate("click");
        expect(localSceneStore.selectedObjectId).to.be.eq("parent");
    });
});