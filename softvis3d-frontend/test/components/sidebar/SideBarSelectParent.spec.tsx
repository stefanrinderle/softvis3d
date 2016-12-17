import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SideBarSelectParent from "../../../src/components/sidebar/SideBarSelectParent";
import { SceneStore } from "../../../src/stores/SceneStore";

describe("<SideBarSelectParent/>", () => {

    it("should show nothing if parent is null", () => {
        let localSceneStore = new SceneStore();

        let sideBarSelectParent = shallow(
            <SideBarSelectParent sceneStore={localSceneStore} parentElement={null}/>
        );

        expect(sideBarSelectParent.children().length).to.be.eq(0);
    });

    it("should show parent if defined", () => {
        let parentElement: TreeElement = createTestTreeElement("parentElement234");
        let localSceneStore = new SceneStore();

        let sideBarSelectParent = shallow(
            <SideBarSelectParent sceneStore={localSceneStore} parentElement={parentElement}/>
        );

        expect(sideBarSelectParent.html().includes("parentElement234")).to.be.true;
    });

    it("should select parent on click", () => {
        let expectedSelectedId: string = "parentElement234";

        let parentElement: TreeElement = createTestTreeElement(expectedSelectedId);
        let localSceneStore = new SceneStore();

        let sideBarSelectParent = shallow(
            <SideBarSelectParent sceneStore={localSceneStore} parentElement={parentElement}/>
        );

        sideBarSelectParent.find("a").simulate("click");

        expect(localSceneStore.selectedObjectId).to.be.eq(expectedSelectedId);
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