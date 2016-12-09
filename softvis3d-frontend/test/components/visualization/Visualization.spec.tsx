import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import VisualizationComponent from "../../../src/components/visualization/VisualizationComponent";
import Scene from "../../../src/components/scene/Scene";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import {SceneStore} from "../../../src/stores/SceneStore";
import TopBar from "../../../src/components/topbar/TopBar";
import BottomBar from "../../../src/components/bottombar/BottomBar";

describe("<VisualizationComponent/>", () => {

    it("should show nothing on start", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        const visualization = shallow(
            <VisualizationComponent cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(visualization.children().length).to.be.eq(3);
        expect(visualization.contains(
            <TopBar sceneStore={localSceneStore} cityBuilderStore={localCityBuilderStore}/>)).to.be.true;
        expect(visualization.contains(<Scene/>)).to.be.true;
        expect(visualization.contains(<BottomBar cityBuilderStore={localCityBuilderStore}/>)).to.be.true;
    });

});