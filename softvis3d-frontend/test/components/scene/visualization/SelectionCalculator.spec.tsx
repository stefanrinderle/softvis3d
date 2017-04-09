import {assert, expect} from "chai";
import * as Sinon from "sinon";
import {SelectionCalculator} from "../../../../src/components/scene/visualization/SelectionCalculator";
import {SoftVis3dMesh} from "../../../../src/components/scene/domain/SoftVis3dMesh";
import {Face3, Geometry, Intersection, MeshLambertMaterial, PerspectiveCamera, Vector3} from "three";

describe("SelectionCalculator", () => {

    it("should return null if no objects in intersection", () => {
        let x: number = 0;
        let y: number = 0;
        let width: number = 0;
        let height: number = 0;

        let camera: PerspectiveCamera = new PerspectiveCamera();

        let objectsInView: SoftVis3dMesh[] = [];

        let result: string | null = SelectionCalculator.makeSelection(x, y, width, height, camera, objectsInView);

        expect(result).to.be.null;
    });

    it("should return object id if object in intersection", () => {
        let x: number = 0;
        let y: number = 0;
        let width: number = 0;
        let height: number = 0;

        let expectedId: string = "sudhfisuhfd";
        let object: SoftVis3dMesh = new SoftVis3dMesh(expectedId, new Geometry(), new MeshLambertMaterial());
        let intersected: Intersection[] = [];
        intersected.push({
            distance: 0,
            distanceToRay: 0,
            point: new Vector3(0, 0, 0),
            index: 0,
            face: new Face3(0, 0, 0),
            faceIndex: 0,
            object: object
        });
        let setRaycaterStub = Sinon.stub(SelectionCalculator.RAYCASTER, "intersectObjects").returns(intersected);

        let objectsInView: SoftVis3dMesh[] = [];
        let camera: PerspectiveCamera = new PerspectiveCamera();

        let result: string | null = SelectionCalculator.makeSelection(x, y, width, height, camera, objectsInView);

        expect(result).to.be.eq(expectedId);

        setRaycaterStub.restore();
    });

    it("should calculate", () => {
        let x: number = 1;
        let y: number = 2;
        let width: number = 3;
        let height: number = 4;

        let setRaycaterStub = Sinon.stub(SelectionCalculator.RAYCASTER, "set");

        let objectsInView: SoftVis3dMesh[] = [];
        let camera: PerspectiveCamera = new PerspectiveCamera();
        let expectedPosition: Vector3 = new Vector3(5, 6, 7);
        camera.position.x = expectedPosition.x;
        camera.position.y = expectedPosition.y;
        camera.position.z = expectedPosition.z;

        let expectedDirection: Vector3 = new Vector3(-0.1554695988275896, -0.002951556127897073, -0.9878362678889718);

        SelectionCalculator.makeSelection(x, y, width, height, camera, objectsInView);

        assert(setRaycaterStub.calledOnce);
        assert(setRaycaterStub.calledWith(expectedPosition, expectedDirection));

        setRaycaterStub.restore();
    });

});