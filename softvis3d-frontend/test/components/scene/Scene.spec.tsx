import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import Scene from "../../../src/components/scene/Scene";
import {SceneStore} from "../../../src/stores/SceneStore";
import SceneInformation from "../../../src/components/scene/information/SceneInformation";
import * as Sinon from "sinon";
import SoftVis3dScene from "../../../src/components/scene/visualization/SoftVis3dScene";

describe("<Scene/>", () => {

    it("should initialize rendering", () => {
        let localSceneStore: SceneStore = new SceneStore();

        const scene = shallow(
            <Scene sceneStore={localSceneStore}/>
        );

        expect(scene.contains(
            <SceneInformation sceneStore={localSceneStore}/>)).to.be.true;
    });

    it("should mount", () => {
        let localSceneStore: SceneStore = new SceneStore();

        let scenePainter: SoftVis3dScene = new SoftVis3dScene();
        localSceneStore.scenePainter = scenePainter;
        let mockScenePainter = Sinon.mock(scenePainter);
        mockScenePainter.expects("init").once();

        let underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore
        };
        underTest.componentDidMount();

        expect(localSceneStore.refreshScene).to.be.true;
        expect(localSceneStore.sceneComponentIsMounted).to.be.true;

        mockScenePainter.verify();
    });

    it("should initialize with selected object id", () => {
        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.selectedObjectId = "suidhfisudhf";

        let scenePainter: SoftVis3dScene = new SoftVis3dScene();
        localSceneStore.scenePainter = scenePainter;
        let mockScenePainter = Sinon.mock(scenePainter);
        mockScenePainter.expects("selectSceneTreeObject").once();
        let mockScenePainterInit = Sinon.mock(scenePainter);
        mockScenePainterInit.expects("init").once();

        let underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore
        };
        underTest.componentDidMount();

        expect(localSceneStore.refreshScene).to.be.true;
        expect(localSceneStore.sceneComponentIsMounted).to.be.true;

        mockScenePainter.verify();
        mockScenePainterInit.verify();
    });

    it("should unmount", () => {
        let localSceneStore: SceneStore = new SceneStore();

        let underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore
        };
        underTest.componentWillUnmount();

        expect(localSceneStore.sceneComponentIsMounted).to.be.false;
    });

});