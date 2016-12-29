import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SideBarElementInfo from "../../../src/components/sidebar/ElementInfo";
import { SceneStore } from "../../../src/stores/SceneStore";

describe("<ElementInfo/>", () => {

    it("should show element", () => {
        let expectedName = "element98szdfkjbsf";
        let selectedElement: TreeElement = createTestTreeElement(expectedName);
        let localSceneStore: SceneStore = new SceneStore();

        const selectedSingleFileInfo = shallow(
            <SideBarElementInfo element={selectedElement} sceneStore={localSceneStore}/>
        );

        expect(selectedSingleFileInfo.html().includes(expectedName)).to.be.true;
    });

    it("should show selected element", () => {
        let expectedName = "element98szdfkjbsf";
        let selectedElement: TreeElement = createTestTreeElement(expectedName);
        let localSceneStore: SceneStore = new SceneStore();

        const selectedSingleFileInfo = shallow(
            <SideBarElementInfo element={selectedElement} selected={true} sceneStore={localSceneStore}/>
        );

        expect(selectedSingleFileInfo.html().includes(expectedName)).to.be.true;
        expect(selectedSingleFileInfo.hasClass("current-selected")).to.be.true;
    });

    it("should select element on click", () => {
        let expectedName = "element98szdfkjbsf";
        let selectedElement: TreeElement = createTestTreeElement(expectedName);
        let localSceneStore: SceneStore = new SceneStore();

        const selectedSingleFileInfo = shallow(
            <SideBarElementInfo element={selectedElement} sceneStore={localSceneStore}/>
        );

        selectedSingleFileInfo.find("li").simulate("click");

        expect(localSceneStore.selectedObjectId).to.be.eq(expectedName);
    });

    it("should do nothing on click on already selected element", () => {
        let expectedName = "element98szdfkjbsf";
        let selectedElement: TreeElement = createTestTreeElement(expectedName);
        let localSceneStore: SceneStore = new SceneStore();

        const selectedSingleFileInfo = shallow(
            <SideBarElementInfo element={selectedElement} selected={true} sceneStore={localSceneStore} />
        );

        selectedSingleFileInfo.find("li").simulate("click");
        expect(localSceneStore.selectedObjectId).to.be.eq(null);
    });

});

function createTestTreeElement(name: string): TreeElement {
    return {
        id: name,
        name,
        isNode: false,

        children: [],

        measures: {},
        parentId: null
    };
}