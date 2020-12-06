import {assert, expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import {Vector3} from "three";
import {SceneKeyInteractions} from "../../../src/components/scene/events/SceneKeyInteractions";
import SceneInformation from "../../../src/components/scene/information/SceneInformation";
import {KeyLegend} from "../../../src/components/scene/KeyLegend";
import Scene from "../../../src/components/scene/Scene";
import ThreeSceneService from "../../../src/components/scene/visualization/ThreeSceneService";
import SceneStore from "../../../src/stores/SceneStore";

describe("<Scene/>", () => {

    it("should initialize", () => {
        const localSceneStore: SceneStore = new SceneStore();
        const cityBuilderStore: any = Sinon.stub();

        const scene = shallow(
            <Scene sceneStore={localSceneStore} cityBuilderStore={cityBuilderStore}/>
        );

        expect(scene.contains(
            <SceneInformation sceneStore={localSceneStore} cityBuilderStore={cityBuilderStore}/> )).to.be.true;
        expect(scene.contains(
            <KeyLegend show={true}/>)).to.be.true;
    });

    it("should mount and bind actions", () => {
        const underTest: Scene = new Scene();

        const stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        const sceneServiceCreateStub = Sinon.stub().returns(stubThreeSceneService);
        ThreeSceneService.create = sceneServiceCreateStub;

        const stubKeyActions: any = Sinon.createStubInstance(SceneKeyInteractions);
        SceneKeyInteractions.create = Sinon.stub().returns(stubKeyActions);

        underTest.componentDidMount();

        assert(sceneServiceCreateStub.called);

        assert(stubKeyActions.addResetCameraEventListener.called);
        assert(stubKeyActions.addToggleLegendEventListener.called);
    });

    it("should unmount", () => {
        const localSceneStore: SceneStore = new SceneStore();
        const cityBuilderStore: any = Sinon.stub();

        const underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore,
            cityBuilderStore
        };

        const stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        ThreeSceneService.create = Sinon.stub().returns(stubThreeSceneService);

        const stubKeyActions: any = Sinon.createStubInstance(SceneKeyInteractions);
        SceneKeyInteractions.create = Sinon.stub().returns(stubKeyActions);

        underTest.componentDidMount();
        underTest.componentWillUnmount();

        assert(stubKeyActions.destroy.called);
        assert(stubThreeSceneService.destroy.called);
    });

    it("should process scene updates - no action if not mounted", () => {
        const localSceneStore: any = Sinon.stub();
        const cityBuilderStore: any = Sinon.stub();
        localSceneStore.selectedObjectId = null;
        localSceneStore.shapesHash = "";

        const underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore,
            cityBuilderStore
        };

        const stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        ThreeSceneService.create = Sinon.stub().returns(stubThreeSceneService);

        underTest.componentDidMount();
        underTest.processSceneUpdates();

        assert(stubThreeSceneService.update.notCalled);
        assert(stubThreeSceneService.selectSceneTreeObject.notCalled);
    });

    it("should process scene updates - update shapes if changed", () => {
        const localSceneStore: any = Sinon.stub();
        const cityBuilderStore: any = Sinon.stub();
        localSceneStore.selectedObjectId = null;
        localSceneStore.shapesHash = "123";

        const underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore,
            cityBuilderStore
        };

        const stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        ThreeSceneService.create = Sinon.stub().returns(stubThreeSceneService);
        const expectedCameraPosition: Vector3 = new Vector3(1, 2, 3);
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
        const expectedObjectId = "123";
        const localSceneStore: any = Sinon.stub();
        const cityBuilderStore: any = Sinon.stub();
        
        localSceneStore.selectedObjectId = expectedObjectId;
        localSceneStore.shapesHash = "";

        const underTest: Scene = new Scene();
        underTest.props = {
            sceneStore: localSceneStore,
            cityBuilderStore
        };

        const stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        ThreeSceneService.create = Sinon.stub().returns(stubThreeSceneService);

        underTest.componentDidMount();
        underTest.processSceneUpdates();

        assert(stubThreeSceneService.selectSceneTreeObject.calledWithExactly(expectedObjectId));

        // only update if not changed - check if inner properties have been updated.

        underTest.processSceneUpdates();

        assert(stubThreeSceneService.selectSceneTreeObject.calledOnce);
    });

});