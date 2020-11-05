import {assert, expect} from "chai";
import * as Sinon from "sinon";
import {Vector3} from "three";
import Metric from "../../../../src/classes/Metric";
import {SceneColorTheme} from "../../../../src/classes/SceneColorTheme";
import VisualizationOptions from "../../../../src/classes/VisualizationOptions";
import {SoftVis3dShape} from "../../../../src/components/scene/domain/SoftVis3dShape";
import {Wrangler} from "../../../../src/components/scene/visualization/objects/Wrangler";
import SoftVis3dScene from "../../../../src/components/scene/visualization/scene/SoftVis3dScene";
import {SelectionCalculator} from "../../../../src/components/scene/visualization/SelectionCalculator";
import ThreeSceneService from "../../../../src/components/scene/visualization/ThreeSceneService";
import {
    BLUEYELLOW_BUILDING_COLOR_THEME,
    DEFAULT_BUILDING_COLOR_THEME
} from "../../../../src/constants/BuildingColorThemes";
import {evostreet} from "../../../../src/constants/Layouts";
import {complexityColorMetric, noColorMetric, noMetricId} from "../../../../src/constants/Metrics";
import {LOGARITHMIC} from "../../../../src/constants/Scales";
import {SceneColorThemes} from "../../../../src/constants/SceneColorThemes";
import {HtmlDomService} from "../../../../src/services/HtmlDomService";
import {createMock} from "../../../Helper";

describe("ThreeSceneService", () => {

    it("should update shapes on start.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let expectedPosition: Vector3 = new Vector3(1, 2, 3);

        let wranglerLoadStub = wrangler.loadSoftVis3d;
        let sceneGetDefaultPositionStub = softvis3dScene.getDefaultCameraPosition;
        sceneGetDefaultPositionStub.returns(expectedPosition);
        let cameraPositionStub = softvis3dScene.setCameraTo;

        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        let options: VisualizationOptions =
            new VisualizationOptions(evostreet, new Metric(noMetricId, "", ""), new Metric(noMetricId, "", ""),
                noColorMetric, LOGARITHMIC, DEFAULT_BUILDING_COLOR_THEME);
        let shapes: SoftVis3dShape[] = [];

        let sceneSetColorThemeStub = softvis3dScene.setColorTheme;
        let colorTheme: SceneColorTheme = SceneColorThemes.availableColorThemes[0];

        underTest.update(shapes, options, colorTheme);

        assert(wranglerLoadStub.calledWith(shapes));
        assert(sceneGetDefaultPositionStub.calledWith(shapes));
        assert(cameraPositionStub.calledWith(expectedPosition));
        assert(sceneSetColorThemeStub.calledWith(colorTheme));
    });

    it("should update shapes on start with camera position.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let expectedPosition: Vector3 = new Vector3(1, 2, 3);

        let wranglerLoadStub = wrangler.loadSoftVis3d;
        let sceneGetDefaultPositionStub = softvis3dScene.getDefaultCameraPosition;
        let cameraPositionStub = softvis3dScene.setCameraTo;

        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        let options: VisualizationOptions =
            new VisualizationOptions(evostreet, new Metric(noMetricId, "", ""), new Metric(noMetricId, "", ""),
                noColorMetric, LOGARITHMIC, DEFAULT_BUILDING_COLOR_THEME);
        let shapes: SoftVis3dShape[] = [];

        let sceneSetColorThemeStub = softvis3dScene.setColorTheme;
        let colorTheme: SceneColorTheme = SceneColorThemes.availableColorThemes[0];

        underTest.update(shapes, options, colorTheme, expectedPosition);

        assert(wranglerLoadStub.calledWith(shapes));
        assert(sceneGetDefaultPositionStub.notCalled);
        assert(cameraPositionStub.calledWith(expectedPosition));
        assert(sceneSetColorThemeStub.calledWith(colorTheme));
    });

    it("should update shapes on color update.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let expectedPosition: Vector3 = new Vector3(1, 2, 3);

        let wranglerUpdateStub = wrangler.updateColorsWithUpdatedShapes;

        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        let exampleMetric: Metric = new Metric(noMetricId, "", "");
        let options: VisualizationOptions =
            new VisualizationOptions(evostreet, exampleMetric, exampleMetric, noColorMetric, LOGARITHMIC, DEFAULT_BUILDING_COLOR_THEME);
        let shapes: SoftVis3dShape[] = [];
        let colorTheme: SceneColorTheme = SceneColorThemes.availableColorThemes[0];

        underTest.update(shapes, options, colorTheme, expectedPosition);

        let optionsWithChangedColor: VisualizationOptions =
            new VisualizationOptions(evostreet, exampleMetric, exampleMetric, complexityColorMetric, LOGARITHMIC, DEFAULT_BUILDING_COLOR_THEME);
        underTest.update(shapes, optionsWithChangedColor, colorTheme, expectedPosition);

        assert(wranglerUpdateStub.calledWith(shapes));
        assert(wranglerUpdateStub.calledOnce);
    });

    it("should update shapes on building color update.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let expectedPosition: Vector3 = new Vector3(1, 2, 3);

        let wranglerUpdateStub = wrangler.updateColorsWithUpdatedShapes;

        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        let exampleMetric: Metric = new Metric(noMetricId, "", "");
        let options: VisualizationOptions =
            new VisualizationOptions(evostreet, exampleMetric, exampleMetric, noColorMetric, LOGARITHMIC, DEFAULT_BUILDING_COLOR_THEME);
        let shapes: SoftVis3dShape[] = [];
        let colorTheme: SceneColorTheme = SceneColorThemes.availableColorThemes[0];

        underTest.update(shapes, options, colorTheme, expectedPosition);

        let optionsWithChangedBuildingColor: VisualizationOptions =
            new VisualizationOptions(evostreet, exampleMetric, exampleMetric, noColorMetric, LOGARITHMIC, BLUEYELLOW_BUILDING_COLOR_THEME);
        underTest.update(shapes, optionsWithChangedBuildingColor, colorTheme, expectedPosition);

        assert(wranglerUpdateStub.calledWith(shapes));
        assert(wranglerUpdateStub.calledOnce);
    });

    it("should select scene object.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let wranglerSelectObjectStub = wrangler.selectSceneTreeObject;

        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        let objectSoftVis3dId: string = "osdufhsidufhiusdfh";

        underTest.selectSceneTreeObject(objectSoftVis3dId);

        assert(wranglerSelectObjectStub.calledWith(objectSoftVis3dId));
    });

    it("should also work if id is null to reset the current selected object.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let wranglerSelectObjectStub = wrangler.selectSceneTreeObject;

        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        underTest.selectSceneTreeObject(null);

        assert(wranglerSelectObjectStub.calledWith(null));
    });

    it("should return camera position.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let expectedPosition: Vector3 = new Vector3(1, 2, 3);
        softvis3dScene.getCameraPosition.returns(expectedPosition);

        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        let result: Vector3 = underTest.getCameraPosition();

        expect(result).to.be.eq(expectedPosition);
    });

    it("should select an object based on an event.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let wranglerSelectObjectStub = wrangler.selectSceneTreeObject;

        let expectedId: string = "djfksjdbf";
        let sceneCalcStub = Sinon.stub(SelectionCalculator, "makeSelection").returns(expectedId);
        let calcPositionStub = Sinon.stub(SelectionCalculator, "calculateSelectionPosition").returns({x: 76, y: 89});

        let htmlDomStub = createMock(HtmlDomService);
        htmlDomStub.getOffsetsById.returns({
            left: 21,
            top: 8787
        });

        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        const event = {
            clientX: 12,
            clientY: 15
        } as any as MouseEvent;

        let result = underTest.makeSelection(event);

        expect(result).to.be.eq(expectedId);
        assert(wranglerSelectObjectStub.called);
        assert(calcPositionStub.called);
        assert(sceneCalcStub.calledWith(76, 89));

        wranglerSelectObjectStub.restore();
        sceneCalcStub.restore();
        calcPositionStub.restore();
    });

    it("should set camera position in scene.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let cameraPositionStub = softvis3dScene.setCameraTo;
        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        let expectedPosition: Vector3 = new Vector3(1, 2, 3);
        underTest.setCameraTo(expectedPosition);

        assert(cameraPositionStub.calledWith(expectedPosition));

        cameraPositionStub.restore();
    });

    it("should reset camera position and recalculate.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let expectedPosition: Vector3 = new Vector3(1, 2, 3);
        let sceneGetDefaultPositionStub = softvis3dScene.getDefaultCameraPosition.returns(expectedPosition);
        let cameraPositionStub = softvis3dScene.setCameraTo;
        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        let shapes: SoftVis3dShape[] = [];
        underTest.resetCameraPosition(shapes);

        assert(cameraPositionStub.calledWith(expectedPosition));
        assert(sceneGetDefaultPositionStub.calledWith(shapes));
    });

    it("should call destory on scene and wrangler on destroy.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        underTest.destroy();

        assert(softvis3dScene.destroy.called);
        assert(wrangler.destroy.called);
    });
});