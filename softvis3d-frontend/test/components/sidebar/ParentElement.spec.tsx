import {expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import {TreeElement} from "../../../src/classes/TreeElement";
import ParentElement from "../../../src/components/sidebar/ParentElement";
import SceneStore from "../../../src/stores/SceneStore";
import {
    createDefaultDir,
    createDefaultDirWithKey,
    createDefaultDirWithKeyAndParent,
    createDefaultFileWithIdAndParent,
    createDefaultFileWithParent
} from "../../classes/TreeElement.spec";

describe("<ParentElement/>", () => {

    it("should show nothing if selected Element has no parent", () => {
        const element = createDefaultDir();
        let localSceneStore = new SceneStore();
        localSceneStore.projectData = element;

        let sideBarSelectParent = shallow(
            <ParentElement sceneStore={localSceneStore} selectedElement={element}/>
        );

        expect(sideBarSelectParent.children().length).to.be.eq(0);
    });

    it("should show nothing if the parent of selected element is root", () => {
        let parent: TreeElement = createDefaultDir();
        let child1: TreeElement = createDefaultFileWithParent(parent);

        parent.children.push(child1);

        let localSceneStore = new SceneStore();
        localSceneStore.projectData = parent;

        let sideBarSelectParent = shallow(
            <ParentElement sceneStore={localSceneStore} selectedElement={parent}/>
        );

        expect(sideBarSelectParent.children()).to.have.length(0);
    });

    it("should select parent folder on click (for node element)", () => {
        let parent: TreeElement = createDefaultDirWithKey("parent", "parent");
        let child1: TreeElement = createDefaultDirWithKeyAndParent("child1", parent);
        let child11: TreeElement = createDefaultFileWithIdAndParent("child11", child1);

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
        let parent: TreeElement = createDefaultDirWithKey("parent", "parent");
        let child1: TreeElement = createDefaultDirWithKeyAndParent("child1", parent);
        let child11: TreeElement = createDefaultFileWithIdAndParent("child11", child1);

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