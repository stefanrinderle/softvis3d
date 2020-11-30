import {assert, expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import {TreeElement} from "../../../src/classes/TreeElement";
import SelectedElementInfo from "../../../src/components/topbar/SelectedElementInfo";
import TreeService from "../../../src/services/TreeService";
import SceneStore from "../../../src/stores/SceneStore";
import {createDefaultDirWithKey, createDefaultFileWithName} from "../../classes/TreeElement.spec";
import {createMock} from "../../Helper";

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
        selectedElement.children.push(createTestTreeElement("child", selectedElement));

        let localTreeService = createMock(TreeService);
        localTreeService.searchTreeNode.returns(selectedElement);

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.projectData = selectedElement;
        localSceneStore.selectedObjectId = selectedElement.id;

        const selectedElementInfo = shallow(
            <SelectedElementInfo sceneStore={localSceneStore}/>
        );

        // no buttons
        expect(selectedElementInfo.children().length).to.be.eq(1);

        expect(selectedElementInfo.html()).to.contain(selectedElement.name);
    });

    it("should show leaf element if leaf details are requested", () => {
        let root: TreeElement = createTestTreeElement("my test element");
        let selectedElement: TreeElement = createTestTreeElement("my test element", root);
        root.children.push(selectedElement);

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.projectData = selectedElement;
        localSceneStore.selectedObjectId = selectedElement.id;

        const selectedElementInfo = shallow(
            <SelectedElementInfo sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.html()).to.contain(selectedElement.name);
    });

    it("should open the source code page on click", () => {
        let expectedKey: string = "iudhsfiushdf";

        let root: TreeElement = createTestTreeElement("my test element");
        let selectedElement: TreeElement = createTestTreeElement(expectedKey, root);
        root.children.push(selectedElement);

        let localTreeService = createMock(TreeService);
        localTreeService.searchTreeNode.returns(selectedElement);

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.projectData = selectedElement;
        localSceneStore.selectedObjectId = selectedElement.id;

        let stub = Sinon.stub(window, "open");

        const selectedElementInfo = shallow(
            <SelectedElementInfo sceneStore={localSceneStore}/>
        );

        selectedElementInfo.find("#open-file-button").simulate("click");

        assert(stub.calledWithExactly("/code?id=" + expectedKey));
        stub.restore();
    });

    it("should open the measures page on click", () => {
        let expectedKey: string = "iudhsfiushdf";

        let root: TreeElement = createTestTreeElement("my test element");
        let selectedElement: TreeElement = createTestTreeElement(expectedKey, root);
        root.children.push(selectedElement);

        let localTreeService = createMock(TreeService);
        localTreeService.searchTreeNode.returns(selectedElement);

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.projectData = selectedElement;
        localSceneStore.selectedObjectId = selectedElement.id;

        let stub = Sinon.stub(window, "open");

        const selectedElementInfo = shallow(
            <SelectedElementInfo sceneStore={localSceneStore}/>
        );

        selectedElementInfo.find("#open-measures-button").simulate("click");

        assert(stub.calledWithExactly("/component_measures?id=" + expectedKey));
        stub.restore();
    });
});

function createTestTreeElement(name: string, parent?: TreeElement, expectedHeightMetricValue: number = 0,
                               expectedFootprintMetricValue: number = 0,
                               expectedColorMetricValue: number = 0): TreeElement {

    let result;
    if (parent) {
        result = createDefaultFileWithName(name);
    } else {
        result = createDefaultDirWithKey(name, name);
    }
    result.measures = {
        c: expectedColorMetricValue,
        h: expectedHeightMetricValue,
        f: expectedFootprintMetricValue
    };
    return result;
}