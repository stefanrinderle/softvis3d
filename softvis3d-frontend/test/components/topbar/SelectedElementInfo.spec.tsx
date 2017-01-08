import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SelectedElementInfo from "../../../src/components/topbar/SelectedElementInfo";
import {SceneStore} from "../../../src/stores/SceneStore";

describe("<SelectedElementInfo/>", () => {

    it("should show default text div on start", () => {
        let localSceneStore: SceneStore = new SceneStore();

        const selectedElementInfo = shallow(
            <SelectedElementInfo sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.html().includes("Select an object to see the details here")).to.be.true;
    });

    it("should show node element if node details are requested", () => {
        let selectedElement: TreeElement = createTestTreeElement("my test element");
        selectedElement.isNode = true;
        selectedElement.children.push(createTestTreeElement("child"));

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.legacyData = selectedElement;
        localSceneStore.selectedObjectId = selectedElement.id;

        const selectedElementInfo = shallow(
            <SelectedElementInfo sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.html()).to.contain(selectedElement.name);
    });
});

function createTestTreeElement(
    name: string,
    expectedHeightMetricValue: number = 0,
    expectedFootprintMetricValue: number = 0,
    expectedColorMetricValue: number = 0
): TreeElement {
    return {
        id: name,
        name,
        isNode: false,

        children: [],

        measures: {
            c: expectedColorMetricValue,
            h: expectedHeightMetricValue,
            f: expectedFootprintMetricValue
        },
        parentId: null
    };
}