import * as React from "react";
import * as Sinon from "sinon";
import { SceneStore } from "../../../src/stores/SceneStore";
import { assert, expect } from "chai";
import { shallow } from "enzyme";
import Scene from "../../../src/components/scene/Scene";
import SceneInformation from "../../../src/components/scene/information/SceneInformation";
import { KeyLegend } from "../../../src/components/scene/KeyLegend";
import ThreeSceneService from "../../../src/components/scene/visualization/ThreeSceneService";
import { Vector3 } from "three";
import { SceneMouseInteractions } from "../../../src/components/scene/events/SceneMouseInteractions";

describe("<Scene/>", () => {

    it("should initialize", () => {
        let localSceneStore: SceneStore = new SceneStore();

        let scene = shallow(
            <Scene sceneStore={localSceneStore}/>
        );

        expect(scene.contains(
            <SceneInformation sceneStore={localSceneStore}/>)).to.be.true;
        expect(scene.contains(
            <KeyLegend show={true}/>)).to.be.true;
    });

    /* TODO:
     * Scene needs to be actively mounted to update/render
     *
     * // it("should initialize with selected object id", () => {
     * //     let localSceneStore: SceneStore = new SceneStore();
     * //     localSceneStore.selectedObjectId = "suidhfisudhf";
     * //
     * //     let underTest: Scene = new Scene();
     * //     underTest.props = {
     * //         sceneStore: localSceneStore
     * //     };
     * //     let stubSceneService: any = Sinon.createStubInstance(ThreeSceneService);
     * //
     * //     underTest.threeSceneService = stubSceneService;
     * //     underTest.render();
     * //
     * //     assert(stubSceneService.update.called);
     * //     assert(stubSceneService.selectSceneTreeObject.called);
     * // });
    */

    it("should mount and bind actions", () => {
        let underTest: Scene = new Scene();

        let stubThreeSceneService: any = Sinon.stub(ThreeSceneService, "create").returns({});
        underTest.threeSceneService = stubThreeSceneService;

        underTest.componentDidMount();

        assert(stubThreeSceneService.called);
    });

    it("should unmount", () => {
        let localSceneStore: SceneStore = new SceneStore();

        let underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore
        };

        let stubMouseActions: any = Sinon.createStubInstance(SceneMouseInteractions);
        underTest.mouseActions = stubMouseActions;
        let stubKeyActions: any = Sinon.createStubInstance(SceneMouseInteractions);
        underTest.keyActions = stubKeyActions;
        let stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        underTest.threeSceneService = stubThreeSceneService;

        underTest.componentWillUnmount();

        assert(stubMouseActions.destroy.called);
        assert(stubKeyActions.destroy.called);
        assert(stubThreeSceneService.destroy.called);
    });

    it("should update camera position", () => {
        let localSceneStore: SceneStore = new SceneStore();

        let expectedCameraPosition: Vector3 = new Vector3(1, 2, 3);

        let underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore
        };

        let stubSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        stubSceneService.getCameraPosition.returns(expectedCameraPosition);
        underTest.threeSceneService = stubSceneService;

        underTest.updateCameraPosition();

        expect(localSceneStore.cameraPosition).not.to.be.null;
        expect(localSceneStore.cameraPosition).not.to.be.undefined;
        if (localSceneStore.cameraPosition) {
            expect(localSceneStore.cameraPosition.x).to.be.eq(expectedCameraPosition.x);
            expect(localSceneStore.cameraPosition.y).to.be.eq(expectedCameraPosition.y);
            expect(localSceneStore.cameraPosition.z).to.be.eq(expectedCameraPosition.z);
        }
    });

});