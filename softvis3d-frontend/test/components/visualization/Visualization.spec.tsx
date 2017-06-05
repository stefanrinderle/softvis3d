import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import Visualization from "../../../src/components/visualization/Visualization";
import Scene from "../../../src/components/scene/Scene";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import {SceneStore} from "../../../src/stores/SceneStore";
import TopBar from "../../../src/components/topbar/TopBar";
import SideBar from "../../../src/components/sidebar/SideBar";
import VisualizationLinkService from "../../../src/services/VisualizationLinkService";
import * as Sinon from "sinon";

describe("<Visualization/>", () => {

    it("should not render any children, when no visualization (shapes) is ready", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);

        localSceneStore.shapes = null;

        const visualization = shallow(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}
                           visualizationLinkService={localVisualizationLinkService}/>
        );

        expect(visualization.children()).to.have.length(1);

        expect(visualization.contains(
            <TopBar sceneStore={localSceneStore} cityBuilderStore={localCityBuilderStore}
                    visualizationLinkService={localVisualizationLinkService}
            />)).to.be.true;
    });

    it("should initialize all elements on start - shapes available but empty", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);

        const visualization = shallow(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}
                           visualizationLinkService={localVisualizationLinkService}/>
        );

        expect(visualization.children()).to.have.length(3);
        expect(visualization.contains(
            <TopBar cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}
                    visualizationLinkService={localVisualizationLinkService}/>)).to.be.true;
        expect(visualization.contains(
            <Scene sceneStore={localSceneStore}/>)).to.be.true;
        expect(visualization.contains(
            <SideBar sceneStore={localSceneStore}/>)).to.be.true;
    });

});