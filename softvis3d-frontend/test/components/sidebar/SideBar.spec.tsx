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
        let parentElement: TreeElement = createTestTreeElement();
        const selectedElementInfo = shallow(
            <SideBar selectedElement={null} sceneStore={localSceneStore}  parentElement={parentElement}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.false;
    });

    it("should show node info for nodes", () => {
        let selectedElement: TreeElement = createTestTreeElement();
        selectedElement.isNode = true;

        let localSceneStore: SceneStore = new SceneStore();
        let parentElement: TreeElement = createTestTreeElement();

        const selectedElementInfo = shallow(
            <SideBar selectedElement={selectedElement} sceneStore={localSceneStore} parentElement={parentElement}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.true;
        expect(selectedElementInfo.contains(<SideBarSelectParent parentElement={parentElement}
                                                                 sceneStore={localSceneStore}/>)).to.be.true;
        expect(selectedElementInfo.contains(<SideBarNodeList selectedElement={selectedElement}
                                                             parentElement={parentElement}
                                                             sceneStore={localSceneStore}/>)).to.be.true;
    });

    it("should show leaf info if leaf", () => {
        let selectedElement: TreeElement = createTestTreeElement();
        selectedElement.isNode = false;

        let localSceneStore: SceneStore = new SceneStore();
        let parentElement: TreeElement = createTestTreeElement();

        const selectedElementInfo = shallow(
            <SideBar selectedElement={selectedElement} sceneStore={localSceneStore} parentElement={parentElement}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.true;
        expect(selectedElementInfo.contains(<SideBarSelectParent parentElement={parentElement}
                                                                 sceneStore={localSceneStore}/>)).to.be.true;
        expect(selectedElementInfo.contains(<SideBarNodeList selectedElement={selectedElement}
                                                             parentElement={parentElement}
                                                             sceneStore={localSceneStore}/>)).to.be.true;
    });

});

function createTestTreeElement(): TreeElement {
    return {
        id: Math.random() + "",
        name: "",
        isNode: false,

        children: [],

        colorMetricValue: 0,
        footprintMetricValue: 0,
        heightMetricValue: 0,
        parentId: null
    };
}