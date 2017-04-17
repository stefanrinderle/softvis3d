import {assert, expect} from "chai";
import * as Sinon from "sinon";
import ThreeSceneService from "../../../../src/components/scene/visualization/ThreeSceneService";
import SoftVis3dScene from "../../../../src/components/scene/visualization/scene/SoftVis3dScene";
import {Vector3} from "three";
import {SoftVis3dShape} from "../../../../src/components/scene/domain/SoftVis3dShape";
import {Wrangler} from "../../../../src/components/scene/visualization/objects/Wrangler";
import {SelectionCalculator} from "../../../../src/components/scene/visualization/SelectionCalculator";
import {HtmlDom} from "../../../../src/services/HtmlDom";
import VisualizationOptions from "../../../../src/classes/VisualizationOptions";
import {evostreet} from "../../../../src/constants/Layouts";
import Metric from "../../../../src/classes/Metric";
import {complexityColorMetric, noColorMetric, noMetricId} from "../../../../src/constants/Metrics";
import {LOGARITHMIC} from "../../../../src/constants/Scales";

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
                                     noColorMetric, LOGARITHMIC);
        let shapes: SoftVis3dShape[] = [];

        underTest.update(shapes, options);

        assert(wranglerLoadStub.calledWith(shapes));
        assert(sceneGetDefaultPositionStub.calledWith(shapes));
        assert(cameraPositionStub.calledWith(expectedPosition));
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
                noColorMetric, LOGARITHMIC);
        let shapes: SoftVis3dShape[] = [];

        underTest.update(shapes, options, expectedPosition);

        assert(wranglerLoadStub.calledWith(shapes));
        assert(sceneGetDefaultPositionStub.notCalled);
        assert(cameraPositionStub.calledWith(expectedPosition));
    });

    it("should update shapes on color update.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let expectedPosition: Vector3 = new Vector3(1, 2, 3);

        let wranglerUpdateStub = wrangler.updateColorsWithUpdatedShapes;

        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        let exampleMetric: Metric = new Metric(noMetricId, "", "");
        let options: VisualizationOptions =
            new VisualizationOptions(evostreet, exampleMetric, exampleMetric, noColorMetric, LOGARITHMIC);
        let shapes: SoftVis3dShape[] = [];

        underTest.update(shapes, options, expectedPosition);

        let optionsWithChangedColor: VisualizationOptions =
            new VisualizationOptions(evostreet, exampleMetric, exampleMetric, complexityColorMetric, LOGARITHMIC);
        underTest.update(shapes, optionsWithChangedColor, expectedPosition);

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

    it("should do nothing if no id provided.", () => {
        let softvis3dScene: any = Sinon.createStubInstance(SoftVis3dScene);
        let wrangler: any = Sinon.createStubInstance(Wrangler);

        let wranglerSelectObjectStub = wrangler.selectSceneTreeObject;

        let underTest: ThreeSceneService = ThreeSceneService.createForTest(softvis3dScene, wrangler);

        underTest.selectSceneTreeObject(null);
        underTest.selectSceneTreeObject();

        assert(wranglerSelectObjectStub.notCalled);
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
        let htmlDomStub = Sinon.stub(HtmlDom, "getOffsetsById").returns({
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

        htmlDomStub.restore();
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

});