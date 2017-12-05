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
import {SoftVis3dMesh} from "../../domain/SoftVis3dMesh";
import {SoftVis3dShape} from "../../domain/SoftVis3dShape";
import {BaseTextObject} from "./BaseTextObject";

export class TextPlatformObject extends BaseTextObject {

    protected calcPosition(cube: SoftVis3dMesh, element: SoftVis3dShape, textGeo: THREE.TextGeometry, z: number) {
        cube.position.x = element.position._x;
        cube.position.y = z + 5;
        cube.position.z = element.position._y;

        // radiant for 90 degree
        let targetRotation = 1.5708;

        cube.rotation.x += targetRotation + Math.PI;

        cube.position.x = element.position._x + (element.dimensions.length / 2) - textGeo.boundingBox.max.length();
        cube.position.z = cube.position.z + (element.dimensions.width / 2);
    }

    protected calcSize(size: number, element: SoftVis3dShape) {
        if (size > element.dimensions.width) {
            size = element.dimensions.width;
        } else if (size < 10) {
            size = 10;
        }
        return size;
    }

}