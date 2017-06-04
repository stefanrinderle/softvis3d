import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import Visualization from "../../../src/components/visualization/Visualization";
import Scene from "../../../src/components/scene/Scene";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import {SceneStore} from "../../../src/stores/SceneStore";
import TopBar from "../../../src/components/topbar/TopBar";
import SideBar from "../../../src/components/sidebar/SideBar";
import {TreeElement} from "../../../src/classes/TreeElement";

describe("<Visualization/>", () => {

    it("should not render any children, when no visualization (shapes) is ready", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        let parentId: string = "parentsduhfisdfuh";
        let expectedParentElement: TreeElement = createTestTreeElement(parentId);

        let testId: string = "siudgffsiuhdsfiu2332";
        let expectedSelectedElement: TreeElement = createTestTreeElement(testId, expectedParentElement);

        expectedParentElement.children.push(expectedSelectedElement);

        localSceneStore.shapes = null;

        localSceneStore.projectData = expectedParentElement;
        localSceneStore.selectedObjectId = testId;

        const visualization = shallow(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(visualization.children()).to.have.length(1);

        expect(visualization.contains(
            <TopBar sceneStore={localSceneStore} cityBuilderStore={localCityBuilderStore}/>)).to.be.true;
    });

    it("should initialize all elements on start - shapes available but empty", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        let testId: string = "siudgffsiuhdsfiu2332";
        let expectedSelectedElement: TreeElement = createTestTreeElement(testId);

        localSceneStore.shapes = {};

        localSceneStore.projectData = expectedSelectedElement;
        localSceneStore.selectedObjectId = testId;

        const visualization = shallow(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(visualization.children()).to.have.length(3);
        expect(visualization.contains(
            <TopBar cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>)).to.be.true;
        expect(visualization.contains(
            <Scene sceneStore={localSceneStore}/>)).to.be.true;
        expect(visualization.contains(
            <SideBar sceneStore={localSceneStore}/>)).to.be.true;
    });

});

function createTestTreeElement(id: string, parent?: TreeElement): TreeElement {
    return new TreeElement(id, "", {}, "", "", true, parent);
}