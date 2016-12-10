import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import SideBarSelectParent from "../../../src/components/sidebar/SideBarSelectParent";
import {SceneStore} from "../../../src/stores/SceneStore";

describe("<SideBarSelectParent/>", () => {

    it("should show nothing if parent is null", () => {
        let selectedElement: TreeElement = createTestTreeElement("root");
        let localSceneStore = new SceneStore();

        let sideBarSelectParent = shallow(
            <SideBarSelectParent sceneStore={localSceneStore} selectedElement={selectedElement}/>
        );

        expect(sideBarSelectParent.children().length).to.be.eq(0);
    });

    it("should show nothing if parent is undefined", () => {
        let selectedElement: TreeElement = createTestTreeElement("root");
        let localSceneStore = new SceneStore();

        let sideBarSelectParent = shallow(
            <SideBarSelectParent sceneStore={localSceneStore} selectedElement={selectedElement}/>
        );

        expect(sideBarSelectParent.children().length).to.be.eq(0);
    });

    it("should show children as list", () => {
        let selectedElement: TreeElement = createTestTreeElement("root");
        selectedElement.parentInfo = createTestTreeElement("parentElement234");
        let localSceneStore = new SceneStore();

        let sideBarSelectParent = shallow(
            <SideBarSelectParent sceneStore={localSceneStore} selectedElement={selectedElement}/>
        );

        expect(sideBarSelectParent.html().includes("parentElement234")).to.be.true;
    });

});

function createTestTreeElement(name: string): TreeElement {
    return {
        id: "",
        name,
        isNode: false,

        children: [],

        colorMetricValue: 0,
        footprintMetricValue: 0,
        heightMetricValue: 0,
        parentInfo: null
    };
}