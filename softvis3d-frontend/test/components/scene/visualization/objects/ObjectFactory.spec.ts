///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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

import { expect } from "chai";
import { ObjectFactory } from "../../../../../src/components/scene/visualization/objects/ObjectFactory";
import { SoftVis3dShape } from "../../../../../src/components/scene/domain/SoftVis3dShape";
import { SoftVis3dMesh } from "../../../../../src/components/scene/domain/SoftVis3dMesh";
import { Vector2 } from "three";

describe("ObjectFactory", () => {

    it("should return emtpy list", () => {
        const input: SoftVis3dShape[] = [];
        const result: SoftVis3dMesh[] = ObjectFactory.getSceneObjects(input);

        expect(result.length).to.be.equal(0);
    });

    it("should return single mesh", () => {
        const expected = "123";

        const input: SoftVis3dShape[] = [];
        input.push(createExampleShape(expected));

        const result: SoftVis3dMesh[] = ObjectFactory.getSceneObjects(input);

        expect(result.length).to.be.equal(1);
        const mesh: SoftVis3dMesh = result[0];
        expect(mesh.getSoftVis3dId()).to.be.equal(expected);
    });

    it("should return multiple mesh", () => {
        const expected1 = "1";
        const expected2 = "2";

        const input: SoftVis3dShape[] = [];
        input.push(createExampleShape(expected1));
        input.push(createExampleShape(expected2));

        const result: SoftVis3dMesh[] = ObjectFactory.getSceneObjects(input);

        expect(result.length).to.be.equal(2);
        expect(result[0].getSoftVis3dId()).to.be.equal(expected1);
        expect(result[1].getSoftVis3dId()).to.be.equal(expected2);
    });

});

function createExampleShape(key: string): SoftVis3dShape {
    const vectors: Vector2[] = [];
    vectors.push(new Vector2(1, 2));
    return new SoftVis3dShape(vectors, key);
}