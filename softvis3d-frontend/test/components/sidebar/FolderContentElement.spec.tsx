import {expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import {TreeElement} from "../../../src/classes/TreeElement";
import FolderContentElement from "../../../src/components/sidebar/FolderContentElement";
import SceneStore from "../../../src/stores/SceneStore";
import {createDefaultFileWithName} from "../../classes/TreeElement.spec";

describe("<FolderContentElement/>", () => {

    it("should show element", () => {
        let expectedName = "element98szdfkjbsf";
        let selectedElement: TreeElement = createDefaultFileWithName(expectedName);
        let localSceneStore: SceneStore = new SceneStore();

        const selectedSingleFileInfo = shallow(
            <FolderContentElement element={selectedElement} sceneStore={localSceneStore} isSelected={false}/>
        );

        expect(selectedSingleFileInfo.html().includes(expectedName)).to.be.true;
    });

    it("should show selected element", () => {
        let expectedName = "element98szdfkjbsf";
        let selectedElement: TreeElement = createDefaultFileWithName(expectedName);
        let localSceneStore: SceneStore = new SceneStore();

        const selectedSingleFileInfo = shallow(
            <FolderContentElement element={selectedElement} sceneStore={localSceneStore} isSelected={true}/>
        );

        expect(selectedSingleFileInfo.html().includes(expectedName)).to.be.true;
        expect(selectedSingleFileInfo.hasClass("current-selected")).to.be.true;
    });

    it("should select element on click", () => {
        let expectedName = "element98szdfkjbsf";
        let selectedElement: TreeElement = createDefaultFileWithName(expectedName);
        let localSceneStore: SceneStore = new SceneStore();

        const selectedSingleFileInfo = shallow(
            <FolderContentElement element={selectedElement} sceneStore={localSceneStore} isSelected={false}/>
        );

        selectedSingleFileInfo.find("li").simulate("click");

        expect(localSceneStore.selectedObjectId).to.be.eq(expectedName);
    });

    it("should do nothing on click on already selected element", () => {
        let expectedName = "element98szdfkjbsf";
        let selectedElement: TreeElement = createDefaultFileWithName(expectedName);
        let localSceneStore: SceneStore = new SceneStore();

        const selectedSingleFileInfo = shallow(
            <FolderContentElement element={selectedElement} isSelected={true} sceneStore={localSceneStore}/>
        );

        selectedSingleFileInfo.find("li").simulate("click");
        expect(localSceneStore.selectedObjectId).to.be.eq(null);
    });

});
