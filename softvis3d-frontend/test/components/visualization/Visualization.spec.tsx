import {expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import Scene from "../../../src/components/scene/Scene";
import SideBar from "../../../src/components/sidebar/SideBar";
import TopBar from "../../../src/components/topbar/TopBar";
import Visualization from "../../../src/components/visualization/Visualization";
import CityBuilderStore from "../../../src/stores/CityBuilderStore";
import SceneStore from "../../../src/stores/SceneStore";

describe("<Visualization/>", () => {

    it("should not render any children, when no visualization (shapes) is ready", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);

        localSceneStore.shapes = null;

        const visualization = shallow(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(visualization.children()).to.have.length(1);

        expect(visualization.contains(
            <TopBar sceneStore={localSceneStore} cityBuilderStore={localCityBuilderStore}/>)).to.be.true;
    });

    it("should initialize all elements on start - shapes available but empty", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);

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