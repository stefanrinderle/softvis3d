import * as React from "react";
import { shallow } from "enzyme";
import {expect} from "chai";
import Scene from "../../../src/components/scene/Scene";
import { SceneStore } from "../../../src/stores/SceneStore";
import SceneInformation from "../../../src/components/scene/information/SceneInformation";

describe("<Scene/>", () => {

    it("should initialize", () => {
        let localSceneStore: SceneStore = new SceneStore();

        const scene = shallow(
            <Scene sceneStore={localSceneStore}/>
        );

        expect(scene.contains(
            <SceneInformation sceneStore={localSceneStore}/>)).to.be.true;
    });

});