import * as React from "react";
import { shallow } from "enzyme";
import Scene from "../../../src/components/scene/Scene";
import { SceneStore } from "../../../src/stores/SceneStore";

describe("<Scene/>", () => {

    it("should initialize", () => {
        let localSceneStore: SceneStore = new SceneStore();

        shallow(
            <Scene sceneStore={localSceneStore}/>
        );
    });

});