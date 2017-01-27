import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Visualization from "../../../src/components/visualization/Visualization";
import Scene from "../../../src/components/scene/Scene";
import { CityBuilderStore } from "../../../src/stores/CityBuilderStore";
import { SceneStore } from "../../../src/stores/SceneStore";
import TopBar from "../../../src/components/topbar/TopBar";
import SideBar from "../../../src/components/sidebar/SideBar";

describe("<Visualization/>", () => {

    it("should initialize all elements on start - selected and parent element given", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        let parentId: string = "parentsduhfisdfuh";
        let expectedParentElement: TreeElement = createTestTreeElement(parentId);

        let testId: string = "siudgffsiuhdsfiu2332";
        let expectedSelectedElement: TreeElement = createTestTreeElement(testId);
        expectedSelectedElement.parentId = expectedParentElement.id;

        expectedParentElement.children.push(expectedSelectedElement);

        // Trigger change on "shapes"
        localSceneStore.shapes = null;

        localSceneStore.legacyData = expectedParentElement;
        localSceneStore.selectedObjectId = testId;

        const visualization = shallow(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(visualization.children()).to.have.length(3);
        expect(visualization.contains(
            <TopBar cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>)).to.be.true;
        expect(visualization.contains(
            <Scene sceneStore={localSceneStore} />)).to.be.true;
        expect(visualization.contains(
            <SideBar sceneStore={localSceneStore}/>)).to.be.true;
    });

    it("should initialize all elements on start - no selected element give", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        // Trigger change on "shapes"
        localSceneStore.shapes = null;

        const visualization = shallow(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(visualization.children()).to.have.length(3);
        expect(visualization.contains(
            <TopBar cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>)).to.be.true;
        expect(visualization.contains(
            <Scene sceneStore={localSceneStore} />)).to.be.true;
        expect(visualization.contains(
            <SideBar sceneStore={localSceneStore}/>)).to.be.true;
    });

    it("should initialize all elements on start - no parent element given", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        let testId: string = "siudgffsiuhdsfiu2332";
        let expectedSelectedElement: TreeElement = createTestTreeElement(testId);

        // Trigger change on "shapes"
        localSceneStore.shapes = null;

        localSceneStore.legacyData = expectedSelectedElement;
        localSceneStore.selectedObjectId = testId;

        const visualization = shallow(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(visualization.children()).to.have.length(3);
        expect(visualization.contains(
            <TopBar cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>)).to.be.true;
        expect(visualization.contains(
            <Scene sceneStore={localSceneStore} />)).to.be.true;
        expect(visualization.contains(
            <SideBar sceneStore={localSceneStore}/>)).to.be.true;
    });

});

function createTestTreeElement(id: string): TreeElement {
    return {
        id,
        name: "",
        isNode: false,

        children: [],

        measures: {},
        parentId: null
    };
}