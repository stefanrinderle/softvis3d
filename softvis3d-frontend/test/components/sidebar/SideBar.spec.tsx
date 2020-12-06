import {expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import {TreeElement} from "../../../src/classes/TreeElement";
import FolderContent from "../../../src/components/sidebar/FolderContent";
import ParentElement from "../../../src/components/sidebar/ParentElement";
import SideBar from "../../../src/components/sidebar/SideBar";
import {
    SQ_QUALIFIER_DIRECTORY,
    SQ_QUALIFIER_FILE
} from "../../../src/services/sonarqube/measures/api/SonarQubeMeasureResponse";
import TreeService from "../../../src/services/TreeService";
import SceneStore from "../../../src/stores/SceneStore";
import {
    createDefaultDir,
    createDefaultFileWithParent
} from "../../classes/TreeElement.spec";
import {createMock} from "../../Helper";

describe("<SideBar/>", () => {

    it("should be empty, if no element is selected", () => {
        const localSceneStore = new SceneStore();

        const selectedElementInfo = shallow(
            <SideBar sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.true;
        expect(selectedElementInfo.find("ul")).to.have.length(0);
    });

    it("should show node info for nodes", () => {
        // does not work - no idea why.
        // let parent: TreeElement = createDefaultDirWithKey("parent", "parent");
        // let child1: TreeElement = createDefaultDirWithKeyAndParent("child1", parent);
        // let child11: TreeElement = createDefaultFileWithIdAndParent("child11", child1);

        const parent: TreeElement = new TreeElement("parent", "parent", {}, "parent", "", SQ_QUALIFIER_DIRECTORY);
        const child1: TreeElement = new TreeElement("child1", "child1", {}, "child1", "", SQ_QUALIFIER_DIRECTORY, parent);
        const child11: TreeElement = new TreeElement("child11", "child11", {}, "child11", "", SQ_QUALIFIER_FILE, child1);

        parent.children.push(child1);
        child1.children.push(child11);

        const localSceneStore: SceneStore = new SceneStore();
        localSceneStore.projectData = parent;
        localSceneStore.selectedObjectId = child1.id;

        const localTreeService = createMock(TreeService);
        localTreeService.searchTreeNode.returns(child1);

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
        const parent: TreeElement = createDefaultDir();
        const child1: TreeElement = createDefaultFileWithParent(parent);
        const child11: TreeElement = createDefaultFileWithParent(child1);

        parent.children.push(child1);
        child1.children.push(child11);

        const localSceneStore: SceneStore = new SceneStore();
        localSceneStore.projectData = parent;
        localSceneStore.selectedObjectId = child11.id;

        const localTreeService = createMock(TreeService);
        localTreeService.searchTreeNode.returns(child11);

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