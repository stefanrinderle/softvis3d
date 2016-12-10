import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import SideBar from "../../../src/components/sidebar/SideBar";
import SideBarNodeInfo from "../../../src/components/sidebar/SideBarNodeInfo";
import SideBarLeafInfo from "../../../src/components/sidebar/SideBarLeafInfo";
import SideBarSelectParent from "../../../src/components/sidebar/SideBarSelectParent";
import {SceneStore} from "../../../src/stores/SceneStore";

describe("<SideBar/>", () => {

    it("should show nothing if nothing selected", () => {
        let localSceneStore = new SceneStore();

        const selectedElementInfo = shallow(
            <SideBar selectedElement={null} sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.false;
    });

    it("should show something if selected", () => {
        let selectedElement: TreeElement = createTestTreeElement();
        selectedElement.isNode = true;

        let localSceneStore = new SceneStore();

        const selectedElementInfo = shallow(
            <SideBar selectedElement={selectedElement} sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.true;
        expect(selectedElementInfo.contains(<SideBarSelectParent selectedElement={selectedElement}
                                                                 sceneStore={localSceneStore}/>)).to.be.true;
        expect(selectedElementInfo.contains(<SideBarNodeInfo selectedElement={selectedElement}/>)).to.be.true;
    });

    it("should show something if selected", () => {
        let selectedElement: TreeElement = createTestTreeElement();
        selectedElement.isNode = false;

        let localSceneStore = new SceneStore();

        const selectedElementInfo = shallow(
            <SideBar selectedElement={selectedElement} sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.hasClass("side-bar")).to.be.true;
        expect(selectedElementInfo.contains(<SideBarSelectParent selectedElement={selectedElement}
                                                                 sceneStore={localSceneStore}/>)).to.be.true;
        expect(selectedElementInfo.contains(<SideBarLeafInfo selectedElement={selectedElement}/>)).to.be.true;
    });

});

function createTestTreeElement(): TreeElement {
    return {
        id: "",
        name: "",
        isNode: false,

        children: [],

        colorMetricValue: 0,
        footprintMetricValue: 0,
        heightMetricValue: 0,
        parentInfo: null
    };
}