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
import { SceneColorTheme } from "../../../../src/classes/SceneColorTheme";
import VisualizationOptionStore from "../../../../src/stores/VisualizationOptionStore";
import { SoftVis3dShape } from "../../../../src/components/scene/domain/SoftVis3dShape";
import { Wrangler } from "../../../../src/components/scene/visualization/objects/Wrangler";
import SoftVis3dScene from "../../../../src/components/scene/visualization/scene/SoftVis3dScene";
import { SelectionCalculator } from "../../../../src/components/scene/visualization/SelectionCalculator";
import ThreeSceneService from "../../../../src/components/scene/visualization/ThreeSceneService";
import { BLUEYELLOW_BUILDING_COLOR_THEME } from "../../../../src/constants/BuildingColorThemes";
import { complexityColorMetric } from "../../../../src/constants/ColorMetrics";
import { SceneColorThemes } from "../../../../src/constants/SceneColorThemes";
import { HtmlDomService } from "../../../../src/services/HtmlDomService";
import { createMock } from "../../../Helper";

describe("ThreeSceneService", () => {
    it("should update shapes on start.", () => {
        const softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        const wrangler: any = Sinon.createStubInstance(Wrangler);

        const expectedPosition: Vector3 = new Vector3(1, 2, 3);

        const wranglerLoadStub = wrangler.loadSoftVis3d;
        const sceneGetDefaultPositionStub = softvis3dScene.getDefaultCameraPosition;
        sceneGetDefaultPositionStub.returns(expectedPosition);
        const cameraPositionStub = softvis3dScene.setCameraTo;

        const underTest: ThreeSceneService = ThreeSceneService.createForTest(
            softvis3dScene,
            wrangler
        );

        const options: VisualizationOptionStore = VisualizationOptionStore.createDefault();
        const shapes: SoftVis3dShape[] = [];

        const sceneSetColorThemeStub = softvis3dScene.setColorTheme;
        const colorTheme: SceneColorTheme = SceneColorThemes.availableColorThemes[0];

        underTest.update(shapes, options, undefined);

        assert(wranglerLoadStub.calledWith(shapes));
        assert(sceneGetDefaultPositionStub.calledWith(shapes));
        assert(cameraPositionStub.calledWith(expectedPosition));
        assert(sceneSetColorThemeStub.calledWith(colorTheme));
    });

    it("should update shapes on start with camera position.", () => {
        const softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        const wrangler: any = Sinon.createStubInstance(Wrangler);

        const expectedPosition: Vector3 = new Vector3(1, 2, 3);

        const wranglerLoadStub = wrangler.loadSoftVis3d;
        const sceneGetDefaultPositionStub = softvis3dScene.getDefaultCameraPosition;
        const cameraPositionStub = softvis3dScene.setCameraTo;

        const underTest: ThreeSceneService = ThreeSceneService.createForTest(
            softvis3dScene,
            wrangler
        );

        const options: VisualizationOptionStore = VisualizationOptionStore.createDefault();
        const shapes: SoftVis3dShape[] = [];

        const sceneSetColorThemeStub = softvis3dScene.setColorTheme;
        const colorTheme: SceneColorTheme = SceneColorThemes.availableColorThemes[0];

        underTest.update(shapes, options, expectedPosition);

        assert(wranglerLoadStub.calledWith(shapes));
        assert(sceneGetDefaultPositionStub.notCalled);
        assert(cameraPositionStub.calledWith(expectedPosition));
        assert(sceneSetColorThemeStub.calledWith(colorTheme));
    });

    it("should update shapes on color update.", () => {
        const softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        const wrangler: any = Sinon.createStubInstance(Wrangler);

        const expectedPosition: Vector3 = new Vector3(1, 2, 3);

        const wranglerUpdateStub = wrangler.updateColorsWithUpdatedShapes;

        const underTest: ThreeSceneService = ThreeSceneService.createForTest(
            softvis3dScene,
            wrangler
        );

        const options: VisualizationOptionStore = VisualizationOptionStore.createDefault();
        const shapes: SoftVis3dShape[] = [];

        underTest.update(shapes, options, expectedPosition);

        const optionsWithChangedColor: VisualizationOptionStore = VisualizationOptionStore.createDefault();
        optionsWithChangedColor.metricColor = complexityColorMetric;
        underTest.update(shapes, optionsWithChangedColor, expectedPosition);

        assert(wranglerUpdateStub.calledWith(shapes));
        assert(wranglerUpdateStub.calledOnce);
    });

    it("should update shapes on building color update.", () => {
        const softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        const wrangler: any = Sinon.createStubInstance(Wrangler);

        const expectedPosition: Vector3 = new Vector3(1, 2, 3);

        const wranglerUpdateStub = wrangler.updateColorsWithUpdatedShapes;

        const underTest: ThreeSceneService = ThreeSceneService.createForTest(
            softvis3dScene,
            wrangler
        );

        const options: VisualizationOptionStore = VisualizationOptionStore.createDefault();
        const shapes: SoftVis3dShape[] = [];

        underTest.update(shapes, options, expectedPosition);

        const optionsWithChangedBuildingColor: VisualizationOptionStore = VisualizationOptionStore.createDefault();
        optionsWithChangedBuildingColor.buildingColorTheme = BLUEYELLOW_BUILDING_COLOR_THEME;
        underTest.update(shapes, optionsWithChangedBuildingColor, expectedPosition);

        assert(wranglerUpdateStub.calledWith(shapes));
        assert(wranglerUpdateStub.calledOnce);
    });

    it("should select scene object.", () => {
        const softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        const wrangler: any = Sinon.createStubInstance(Wrangler);

        const wranglerSelectObjectStub = wrangler.selectSceneTreeObject;

        const underTest: ThreeSceneService = ThreeSceneService.createForTest(
            softvis3dScene,
            wrangler
        );

        const objectSoftVis3dId = "osdufhsidufhiusdfh";

        underTest.selectSceneTreeObject(objectSoftVis3dId);

        assert(wranglerSelectObjectStub.calledWith(objectSoftVis3dId));
    });

    it("should also work if id is null to reset the current selected object.", () => {
        const softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        const wrangler: any = Sinon.createStubInstance(Wrangler);

        const wranglerSelectObjectStub = wrangler.selectSceneTreeObject;

        const underTest: ThreeSceneService = ThreeSceneService.createForTest(
            softvis3dScene,
            wrangler
        );

        underTest.selectSceneTreeObject(null);

        assert(wranglerSelectObjectStub.calledWith(null));
    });

    it("should return camera position.", () => {
        const softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        const wrangler: any = Sinon.createStubInstance(Wrangler);

        const expectedPosition: Vector3 = new Vector3(1, 2, 3);
        softvis3dScene.getCameraPosition.returns(expectedPosition);

        const underTest: ThreeSceneService = ThreeSceneService.createForTest(
            softvis3dScene,
            wrangler
        );

        const result: Vector3 = underTest.getCameraPosition();

        expect(result).to.be.eq(expectedPosition);
    });

    it("should select an object based on an event.", () => {
        const softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        const wrangler: any = Sinon.createStubInstance(Wrangler);

        const wranglerSelectObjectStub = wrangler.selectSceneTreeObject;

        const expectedId = "djfksjdbf";
        const sceneCalcStub = Sinon.stub(SelectionCalculator, "makeSelection").returns(expectedId);
        const calcPositionStub = Sinon.stub(
            SelectionCalculator,
            "calculateSelectionPosition"
        ).returns({ x: 76, y: 89 });

        const htmlDomStub = createMock(HtmlDomService);
        htmlDomStub.getOffsetsById.returns({
            left: 21,
            top: 8787,
        });

        const underTest: ThreeSceneService = ThreeSceneService.createForTest(
            softvis3dScene,
            wrangler
        );

        const event = ({
            clientX: 12,
            clientY: 15,
        } as any) as MouseEvent;

        const result = underTest.makeSelection(event);

        expect(result).to.be.eq(expectedId);
        assert(wranglerSelectObjectStub.called);
        assert(calcPositionStub.called);
        assert(sceneCalcStub.calledWith(76, 89));

        wranglerSelectObjectStub.restore();
        sceneCalcStub.restore();
        calcPositionStub.restore();
    });

    it("should set camera position in scene.", () => {
        const softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        const wrangler: any = Sinon.createStubInstance(Wrangler);

        const cameraPositionStub = softvis3dScene.setCameraTo;
        const underTest: ThreeSceneService = ThreeSceneService.createForTest(
            softvis3dScene,
            wrangler
        );

        const expectedPosition: Vector3 = new Vector3(1, 2, 3);
        underTest.setCameraTo(expectedPosition);

        assert(cameraPositionStub.calledWith(expectedPosition));

        cameraPositionStub.restore();
    });

    it("should reset camera position and recalculate.", () => {
        const softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        const wrangler: any = Sinon.createStubInstance(Wrangler);

        const expectedPosition: Vector3 = new Vector3(1, 2, 3);
        const sceneGetDefaultPositionStub = softvis3dScene.getDefaultCameraPosition.returns(
            expectedPosition
        );
        const cameraPositionStub = softvis3dScene.setCameraTo;
        const underTest: ThreeSceneService = ThreeSceneService.createForTest(
            softvis3dScene,
            wrangler
        );

        const shapes: SoftVis3dShape[] = [];
        underTest.resetCameraPosition(shapes);

        assert(cameraPositionStub.calledWith(expectedPosition));
        assert(sceneGetDefaultPositionStub.calledWith(shapes));
    });

    it("should call destory on scene and wrangler on destroy.", () => {
        const softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        const wrangler: any = Sinon.createStubInstance(Wrangler);

        const underTest: ThreeSceneService = ThreeSceneService.createForTest(
            softvis3dScene,
            wrangler
        );

        underTest.destroy();

        assert(softvis3dScene.destroy.called);
        assert(wrangler.destroy.called);
    });
});
