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

export class TextStreetObject extends BaseTextObject {

    private rotate = false;

    public create(element: SoftVis3dShape, name: string, font: any): SoftVis3dMesh {
        if (element.dimensions.width > element.dimensions.length) {
            this.rotate = true;
        }

        return super.create(element, name, font);
    }

    protected calcPosition(cube: SoftVis3dMesh, element: SoftVis3dShape, textGeo: THREE.TextGeometry, z: number) {
        cube.position.x = element.position._x;
        cube.position.y = z + 1;
        cube.position.z = element.position._y;

        // radiant for 90 degree
        let targetRotation = 1.5708;

        if (this.rotate) {
            cube.rotation.x += targetRotation + Math.PI;
            cube.rotation.z += targetRotation;

            cube.position.z = element.position._y + (textGeo.boundingBox.max.x / 2);

            cube.position.x = cube.position.x + (textGeo.boundingBox.max.y / 2);
        } else {
            cube.rotation.x += targetRotation + Math.PI;

            cube.position.x = element.position._x - (textGeo.boundingBox.max.x / 2);
            cube.position.z = cube.position.z + (textGeo.boundingBox.max.y / 2);
        }
    }

    protected calcSize(size: number, element: SoftVis3dShape): number {
        if (this.rotate) {
            if (size > element.dimensions.length) {
                size = element.dimensions.length;
            } else if (size < 10) {
                size = 10;
            }
        } else {
            if (size > element.dimensions.width) {
                size = element.dimensions.width;
            } else if (size < 10) {
                size = 10;
            }
        }

        return size;
    }

}