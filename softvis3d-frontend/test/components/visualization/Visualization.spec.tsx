import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Visualization from "../../../src/components/visualization/Visualization";
import Scene from "../../../src/components/scene/Scene";
import { CityBuilderStore } from "../../../src/stores/CityBuilderStore";
import { SceneStore } from "../../../src/stores/SceneStore";
import TopBar from "../../../src/components/topbar/TopBar";
import BottomBar from "../../../src/components/bottombar/BottomBar";
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

        localSceneStore.legacyData = expectedParentElement;
        localSceneStore.selectedObjectId = testId;

        const visualization = shallow(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(visualization.children().length).to.be.eq(4);
        expect(visualization.contains(
            <TopBar cityBuilderStore={localCityBuilderStore} selectedElement={expectedSelectedElement}/>)).to.be.true;
        expect(visualization.contains(<Scene sceneStore={localSceneStore} />)).to.be.true;
        expect(visualization.contains(<BottomBar cityBuilderStore={localCityBuilderStore}/>)).to.be.true;
        expect(visualization.contains(
            <SideBar sceneStore={localSceneStore} selectedElement={expectedSelectedElement}/>)).to.be.true;
    });

    it("should initialize all elements on start - no selected element give", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        const visualization = shallow(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(visualization.children().length).to.be.eq(4);
        expect(visualization.contains(
            <TopBar selectedElement={null} cityBuilderStore={localCityBuilderStore}/>)).to.be.true;
        expect(visualization.contains(<Scene sceneStore={localSceneStore} />)).to.be.true;
        expect(visualization.contains(<BottomBar cityBuilderStore={localCityBuilderStore}/>)).to.be.true;
        expect(visualization.contains(
            <SideBar sceneStore={localSceneStore} selectedElement={null}/>)).to.be.true;
    });

    it("should initialize all elements on start - no parent element given", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        let testId: string = "siudgffsiuhdsfiu2332";
        let expectedSelectedElement: TreeElement = createTestTreeElement(testId);

        localSceneStore.legacyData = expectedSelectedElement;
        localSceneStore.selectedObjectId = testId;

        const visualization = shallow(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(visualization.children().length).to.be.eq(4);
        expect(visualization.contains(
            <TopBar cityBuilderStore={localCityBuilderStore} selectedElement={expectedSelectedElement}/>)).to.be.true;
        expect(visualization.contains(<Scene sceneStore={localSceneStore} />)).to.be.true;
        expect(visualization.contains(<BottomBar cityBuilderStore={localCityBuilderStore}/>)).to.be.true;
        expect(visualization.contains(
            <SideBar sceneStore={localSceneStore} selectedElement={expectedSelectedElement}/>)).to.be.true;
    });

});

function createTestTreeElement(id: string): TreeElement {
    return {
        id,
        name: "",
        isNode: false,

        children: [],

        colorMetricValue: 0,
        footprintMetricValue: 0,
        heightMetricValue: 0,
        parentId: null
    };
}