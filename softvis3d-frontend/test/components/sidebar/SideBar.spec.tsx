import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SideBar from "../../../src/components/sidebar/SideBar";
import FolderContent from "../../../src/components/sidebar/FolderContent";
import ParentElement from "../../../src/components/sidebar/ParentElement";
import { SceneStore } from "../../../src/stores/SceneStore";
import {TreeElement} from "../../../src/classes/TreeElement";

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
        let parent: TreeElement = new TreeElement("parent", "parent", {}, "parent", "", false);
        let child1: TreeElement = new TreeElement("child1", "child1", {}, "child1", "", false, parent);
        let child11: TreeElement = new TreeElement("child11", "child11", {}, "child11", "", true, child1);

        parent.children.push(child1);
        child1.children.push(child11);

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.projectData = parent;
        localSceneStore.selectedObjectId = child1.id;

        const shallowSidebar = shallow(
            <SideBar sceneStore={localSceneStore}/>
        );

        expect(shallowSidebar.hasClass("side-bar")).to.be.true;

        expect(shallowSidebar.contains(
            <ParentElement
                selectedElement={child1}
                sceneStore={localSceneStore}/>
        )).to.be.true;

        expect(shallowSidebar.contains(
            <FolderContent
                activeFolder={child1}
                sceneStore={localSceneStore}
            />
        )).to.be.true;

        expect(shallowSidebar.html()).to.contain(child1.id);
        expect(shallowSidebar.html()).to.contain(child11.id);
    });

    it("should show node info for leafs", () => {
        let parent: TreeElement = new TreeElement("parent", "parent", {}, "parent", "", false);
        let child1: TreeElement = new TreeElement("child1", "child1", {}, "child1", "", false, parent);
        let child11: TreeElement = new TreeElement("child11", "child11", {}, "child11", "", true, child1);

        parent.children.push(child1);
        child1.children.push(child11);

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.projectData = parent;
        localSceneStore.selectedObjectId = child11.id;

        const shallowSidebar = shallow(
            <SideBar sceneStore={localSceneStore}/>
        );

        expect(shallowSidebar.hasClass("side-bar")).to.be.true;

        expect(shallowSidebar.contains(
            <ParentElement
                selectedElement={child11}
                sceneStore={localSceneStore}/>
        )).to.be.true;

        expect(shallowSidebar.contains(
            <FolderContent
                activeFolder={child1}
                sceneStore={localSceneStore}
            />
        )).to.be.true;

        expect(shallowSidebar.html()).to.contain(child1.id);
        expect(shallowSidebar.html()).to.contain(child11.id);
    });
});