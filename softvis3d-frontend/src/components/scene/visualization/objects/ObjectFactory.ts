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

import { MeshLambertMaterial, BoxGeometry } from "three";
import { SoftVis3dMesh } from "../../domain/SoftVis3dMesh";
import { SoftVis3dShape } from "../../domain/SoftVis3dShape";

export class ObjectFactory {

    public static getSceneObjects(shapes: SoftVis3dShape[]): SoftVis3dMesh[] {
        let result: SoftVis3dMesh[] = [];

        for (let shape of shapes) {
            result.push(this._getShape(shape));
        }

        return result;
    }

    private static _getShape(element: SoftVis3dShape): SoftVis3dMesh {
        element.opacity = 1;

        let z = element.position._z + Math.floor(element.dimensions.height / 2);

        let geometry = new BoxGeometry(
            element.dimensions.length,
            element.dimensions.height,
            element.dimensions.width,
            0,
            0,
            0
        );

        let material = new MeshLambertMaterial({
            color: element.color,
            transparent: true,
            opacity: element.opacity
        });

        let cube: SoftVis3dMesh = new SoftVis3dMesh(element.key, geometry, material);
        cube.position.setX(element.position._x);
        cube.position.setY(z);
        cube.position.setZ(element.position._y);

        return cube;
    }
}
