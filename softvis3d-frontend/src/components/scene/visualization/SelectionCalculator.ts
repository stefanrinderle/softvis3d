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
import {Raycaster, Vector3, Intersection} from "three";
import {Camera} from "./Camera";
import {SoftVis3dMesh} from "../domain/SoftVis3dMesh";

export class SelectionService {

    public static RAYCASTER = new Raycaster();

    public static makeSelection(x: number, y: number, width: number, height: number,
                                camera: Camera, objectsInView: SoftVis3dMesh[]): string | null {

        // creating NDC coordinates for ray intersection.
        let mouseDownX: number = (x / width) * 2 - 1;
        let mouseDownY: number = -(y / height) * 2 + 1;

        let vector = new Vector3(mouseDownX, mouseDownY, 1).unproject(camera.getCamera());

        let cameraPosition = camera.getCameraPosition();
        SelectionService.RAYCASTER.set(cameraPosition, vector.sub(cameraPosition).normalize());
        let intersected: Intersection[] =
            SelectionService.RAYCASTER.intersectObjects(objectsInView, true);

        let result: string | null = null;
        if (intersected.length > 0) {
            let object: SoftVis3dMesh = <SoftVis3dMesh> intersected[0].object;
            result = object.getSoftVis3dId();
        }

        return result;
    }
}
