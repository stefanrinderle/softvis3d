import {assert, expect} from "chai";
import * as Sinon from "sinon";
import {SelectionCalculator} from "../../../../src/components/scene/visualization/SelectionCalculator";
import {SoftVis3dMesh} from "../../../../src/components/scene/domain/SoftVis3dMesh";
import {Face3, Geometry, Intersection, MeshLambertMaterial, PerspectiveCamera, Vector3} from "three";
import {Offset} from "../../../../src/services/HtmlDom";

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
            object
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

        const callArgs = setRaycaterStub.getCall(0).args;
        expect(callArgs).to.be.lengthOf(2, "Invalid Argument Count");

        expect(callArgs[0]).to.be.instanceOf(expectedPosition.constructor, "Argument 1 Types did not match");
        expect(callArgs[0]).to.deep.equal(expectedPosition, "Positions did not match");

        expect(callArgs[1]).to.be.instanceOf(expectedDirection.constructor, "Argument 2 Types did not match");
        expect(callArgs[1].x).to.be.closeTo(expectedDirection.x, 1e-5);
        expect(callArgs[1].y).to.be.closeTo(expectedDirection.y, 1e-5);
        expect(callArgs[1].z).to.be.closeTo(expectedDirection.z, 1e-5);

        setRaycaterStub.restore();
    });

    it("should calculate selection position", () => {
        const mouseEvent = {
            clientX: 3423,
            clientY: 4545
        } as any as MouseEvent;
        const offset: Offset = new Offset(3443, 5665);

        let result = SelectionCalculator.calculateSelectionPosition(mouseEvent, offset);

        expect(result.x).to.be.eq(-2242);
        expect(result.y).to.be.eq(1102);
    });
});