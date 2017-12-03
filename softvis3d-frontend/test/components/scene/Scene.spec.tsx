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
import { SceneKeyInteractions } from "../../../src/components/scene/events/SceneKeyInteractions";

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

    it("should mount and bind actions", () => {
        let underTest: Scene = new Scene();

        let stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        let sceneServiceCreateStub = Sinon.stub().returns(stubThreeSceneService);
        ThreeSceneService.create = sceneServiceCreateStub;

        let stubKeyActions: any = Sinon.createStubInstance(SceneKeyInteractions);
        SceneKeyInteractions.create = Sinon.stub().returns(stubKeyActions);

        underTest.componentDidMount();

        assert(sceneServiceCreateStub.called);

        assert(stubKeyActions.addResetCameraEventListener.called);
        assert(stubKeyActions.addToggleLegendEventListener.called);
        assert(stubKeyActions.addToggleColorThemeEventListener.called);
    });

    it("should unmount", () => {
        let localSceneStore: SceneStore = new SceneStore();

        let underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore
        };

        let stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        ThreeSceneService.create = Sinon.stub().returns(stubThreeSceneService);

        let stubKeyActions: any = Sinon.createStubInstance(SceneKeyInteractions);
        SceneKeyInteractions.create = Sinon.stub().returns(stubKeyActions);

        underTest.componentDidMount();
        underTest.componentWillUnmount();

        assert(stubKeyActions.destroy.called);
        assert(stubThreeSceneService.destroy.called);
    });

    it("should process scene updates - no action if not mounted", () => {
        let localSceneStore: any = Sinon.stub();
        localSceneStore.selectedObjectId = null;
        localSceneStore.shapesHash = "";

        let underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore
        };

        let stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        ThreeSceneService.create = Sinon.stub().returns(stubThreeSceneService);

        underTest.componentDidMount();
        underTest.processSceneUpdates();

        assert(stubThreeSceneService.update.notCalled);
        assert(stubThreeSceneService.selectSceneTreeObject.notCalled);
    });

    it("should process scene updates - update shapes if changed", () => {
        let localSceneStore: any = Sinon.stub();
        localSceneStore.selectedObjectId = null;
        localSceneStore.shapesHash = "123";

        let underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore
        };

        let stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        ThreeSceneService.create = Sinon.stub().returns(stubThreeSceneService);
        let expectedCameraPosition: Vector3 = new Vector3(1, 2, 3);
        stubThreeSceneService.getCameraPosition.returns(expectedCameraPosition);

        underTest.componentDidMount();
        underTest.processSceneUpdates();

        assert(stubThreeSceneService.update.called);
        assert(stubThreeSceneService.getCameraPosition.called);

        // only update if not changed - check if inner properties have been updated.

        underTest.processSceneUpdates();

        assert(stubThreeSceneService.update.calledOnce);
        assert(stubThreeSceneService.getCameraPosition.calledOnce);

        expect(localSceneStore.cameraPosition).not.to.be.null;
        expect(localSceneStore.cameraPosition).not.to.be.undefined;
        if (localSceneStore.cameraPosition) {
            expect(localSceneStore.cameraPosition).to.be.eq(expectedCameraPosition);
        }
    });

    it("should process scene updates - update selected objectr if changed", () => {
        let expectedObjectId = "123";
        let localSceneStore: any = Sinon.stub();
        localSceneStore.selectedObjectId = expectedObjectId;
        localSceneStore.shapesHash = "";

        let underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore
        };

        let stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        ThreeSceneService.create = Sinon.stub().returns(stubThreeSceneService);

        underTest.componentDidMount();
        underTest.processSceneUpdates();

        assert(stubThreeSceneService.selectSceneTreeObject.calledWithExactly(expectedObjectId));

        // only update if not changed - check if inner properties have been updated.

        underTest.processSceneUpdates();

        assert(stubThreeSceneService.selectSceneTreeObject.calledOnce);
    });

});