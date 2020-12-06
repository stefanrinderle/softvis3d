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

import {assert, expect} from "chai";
import * as Sinon from "sinon";
import {Face3, Geometry, Intersection, MeshLambertMaterial, PerspectiveCamera, Vector3} from "three";
import {SoftVis3dMesh} from "../../../../src/components/scene/domain/SoftVis3dMesh";
import {SelectionCalculator} from "../../../../src/components/scene/visualization/SelectionCalculator";
import {Offset} from "../../../../src/services/HtmlDomService";

describe("SelectionCalculator", () => {

    it("should return null if no objects in intersection", () => {
        const x = 0;
        const y = 0;
        const width = 0;
        const height = 0;

        const camera: PerspectiveCamera = new PerspectiveCamera();

        const objectsInView: SoftVis3dMesh[] = [];

        const result: string | null = SelectionCalculator.makeSelection(x, y, width, height, camera, objectsInView);

        expect(result).to.be.null;
    });

    it("should return object id if object in intersection", () => {
        const x = 0;
        const y = 0;
        const width = 0;
        const height = 0;

        const expectedId = "sudhfisuhfd";
        const object: SoftVis3dMesh = new SoftVis3dMesh(expectedId, new Geometry(), new MeshLambertMaterial());
        const intersected: Intersection[] = [];
        intersected.push({
            distance: 0,
            distanceToRay: 0,
            point: new Vector3(0, 0, 0),
            index: 0,
            face: new Face3(0, 0, 0),
            faceIndex: 0,
            object
        });
        const setRaycaterStub = Sinon.stub(SelectionCalculator.RAYCASTER, "intersectObjects").returns(intersected);

        const objectsInView: SoftVis3dMesh[] = [];
        const camera: PerspectiveCamera = new PerspectiveCamera();

        const result: string | null = SelectionCalculator.makeSelection(x, y, width, height, camera, objectsInView);

        expect(result).to.be.eq(expectedId);

        setRaycaterStub.restore();
    });

    it("should calculate", () => {
        const x = 1;
        const y = 2;
        const width = 3;
        const height = 4;

        const setRaycaterStub = Sinon.stub(SelectionCalculator.RAYCASTER, "set");

        const objectsInView: SoftVis3dMesh[] = [];
        const camera: PerspectiveCamera = new PerspectiveCamera();
        const expectedPosition: Vector3 = new Vector3(5, 6, 7);
        camera.position.x = expectedPosition.x;
        camera.position.y = expectedPosition.y;
        camera.position.z = expectedPosition.z;

        const expectedDirection: Vector3 = new Vector3(-0.1554695988275896, -0.002951556127897073, -0.9878362678889718);

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

        const result = SelectionCalculator.calculateSelectionPosition(mouseEvent, offset);

        expect(result.x).to.be.eq(-2242);
        expect(result.y).to.be.eq(1102);
    });
});