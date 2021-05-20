///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import { assert, expect } from "chai";
import * as Sinon from "sinon";
import { Vector3 } from "three";
import { SceneKeyInteractions } from "../../../src/components/scene/events/SceneKeyInteractions";
import Scene from "../../../src/components/scene/Scene";
import ThreeSceneService from "../../../src/components/scene/visualization/ThreeSceneService";
import CityBuilderStore from "../../../src/stores/CityBuilderStore";
import SceneStore from "../../../src/stores/SceneStore";
import { createMockInjection } from "../../Helper";

describe("<Scene/>", () => {
    // TODO: fix ThreeSceneService.create to be able to mock ThreeSceneService
    // it("should initialize", () => {
    //     createMockInjection(new SceneStore());
    //     createMockInjection(VisualizationOptionStore.createDefault());
    //
    //     const scene = shallow(<Scene />);
    //
    //     expect(scene.contains(<SceneInformation />)).to.be.true;
    //     expect(scene.contains(<KeyLegend show={true} />)).to.be.true;
    // });

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
        createMockInjection(new SceneStore());
        createMockInjection(new CityBuilderStore());

        const underTest: Scene = new Scene();

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
        createMockInjection(new CityBuilderStore());
        const localSceneStore: any = Sinon.stub();
        localSceneStore.selectedObjectKey = null;
        localSceneStore.shapesHash = "";
        createMockInjection(localSceneStore);

        const underTest: Scene = new Scene();

        const stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        ThreeSceneService.create = Sinon.stub().returns(stubThreeSceneService);

        underTest.componentDidMount();
        underTest.processSceneUpdates();

        assert(stubThreeSceneService.update.notCalled);
        assert(stubThreeSceneService.selectSceneTreeObject.notCalled);
    });

    it("should process scene updates - update shapes if changed", () => {
        createMockInjection(new CityBuilderStore());
        const localSceneStore: any = createMockInjection(new SceneStore());
        localSceneStore.selectedObjectKey = null;
        localSceneStore.shapesHash = "123";
        createMockInjection(localSceneStore);

        const underTest: Scene = new Scene();

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
        createMockInjection(new CityBuilderStore());

        const selectedObjectKey = "123";
        const localSceneStore: any = createMockInjection(new SceneStore());
        localSceneStore.selectedObjectKey = selectedObjectKey;
        localSceneStore.shapesHash = "";
        createMockInjection(localSceneStore);

        const underTest: Scene = new Scene();

        const stubThreeSceneService: any = Sinon.createStubInstance(ThreeSceneService);
        ThreeSceneService.create = Sinon.stub().returns(stubThreeSceneService);

        underTest.componentDidMount();
        underTest.processSceneUpdates();

        assert(stubThreeSceneService.selectSceneTreeObject.calledWithExactly(selectedObjectKey));

        // only update if not changed - check if inner properties have been updated.

        underTest.processSceneUpdates();

        assert(stubThreeSceneService.selectSceneTreeObject.calledOnce);
    });
});
