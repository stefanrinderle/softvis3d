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

import {Intersection, PerspectiveCamera, Raycaster, Vector3} from "three";
import {Offset} from "../../../services/HtmlDomService";
import {SoftVis3dMesh} from "../domain/SoftVis3dMesh";

export class SelectionCalculator {

    public static RAYCASTER = new Raycaster();

    public static makeSelection(x: number, y: number, width: number, height: number,
                                camera: PerspectiveCamera, objectsInView: SoftVis3dMesh[]): string | null {

        // creating NDC coordinates for ray intersection.
        const mouseDownX: number = (x / width) * 2 - 1;
        const mouseDownY: number = -(y / height) * 2 + 1;

        const vector = new Vector3(mouseDownX, mouseDownY, 1).unproject(camera);

        const cameraPosition = camera.position;
        SelectionCalculator.RAYCASTER.set(cameraPosition, vector.sub(cameraPosition).normalize());
        const intersected: Intersection[] =
            SelectionCalculator.RAYCASTER.intersectObjects(objectsInView, true);

        let result: string | null = null;
        if (intersected.length > 0) {
            const object: SoftVis3dMesh = intersected[0].object as SoftVis3dMesh;
            result = object.getSoftVis3dId();
        }

        return result;
    }

    public static calculateSelectionPosition(event: MouseEvent, offset: Offset) {
        let x: number = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        let y: number = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;

        x -= offset.left;
        y -= offset.top;

        return {x, y};
    }
}
