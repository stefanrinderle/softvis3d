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
import { MeshLambertMaterial, TextGeometry } from "three";
import { SoftVis3dMesh } from "../../domain/SoftVis3dMesh";
import { SoftVis3dShape } from "../../domain/SoftVis3dShape";

export abstract class BaseTextObject {

    public create(element: SoftVis3dShape, name: string, font: any): SoftVis3dMesh {
        let curveSegments = 4;
        let bevelThickness = 1;
        let bevelSize = 1;
        let bevelEnabled = false;

        let maxValue = Math.max(element.dimensions.length, element.dimensions.width, element.dimensions.height);
        let size = maxValue / 25;
        let height = 3;

        size = this.calcSize(size, element);

        let textGeo = new TextGeometry(name, {
            font,
            size,
            height,
            curveSegments,
            bevelThickness,
            bevelSize,
            bevelEnabled
        });

        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();

        let material = new MeshLambertMaterial({
            color: "#ff0000",
            transparent: false
        });

        let z = element.position._z + Math.floor(element.dimensions.height / 2);

        // TODO: Should be set an id? If yes, which one?
        let cube: SoftVis3dMesh = new SoftVis3dMesh("uidhfisuhdfiushdfiuhsdifuhsi", textGeo, material);

        this.calcPosition(cube, element, textGeo, z);

        return cube;
    }

    protected abstract calcPosition(cube: SoftVis3dMesh, element: SoftVis3dShape, textGeo: THREE.TextGeometry, z: number): void;

    protected abstract calcSize(size: number, element: SoftVis3dShape): number;

}