import * as React from "react";
import { shallow } from "enzyme";
import {expect} from "chai";
import Scene from "../../../src/components/scene/Scene";
import { SceneStore } from "../../../src/stores/SceneStore";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import SceneInformation from "../../../src/components/scene/information/SceneInformation";

describe("<Scene/>", () => {

    it("should initialize", () => {
        let localSceneStore: SceneStore = new SceneStore();
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        const scene = shallow(
            <Scene cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(scene.contains(
            <SceneInformation cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>)).to.be.true;
    });

});