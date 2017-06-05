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

import {MeshLambertMaterial, Scene} from "three";
import {ObjectFactory} from "./ObjectFactory";
import {SoftVis3dMesh} from "../../domain/SoftVis3dMesh";
import {SoftVis3dShape} from "../../domain/SoftVis3dShape";

interface SoftVis3dSelectedObject {
    object: SoftVis3dMesh;
    color: number;
}

/**
 * @class This is a resource manager and loads individual models.
 *
 * @struct
 * @constructor
 */
export class Wrangler {

    private scene: Scene;
    private objectsInView: SoftVis3dMesh[] = [];
    private selectedTreeObjects: SoftVis3dSelectedObject[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public loadSoftVis3d(data: SoftVis3dShape[]) {
        this.removeAllFromScene();

        this.objectsInView = ObjectFactory.getSceneObjects(data);

        for (let object of this.objectsInView) {
            this.scene.add(object);
        }
    }

    public updateColorsWithUpdatedShapes(shapes: SoftVis3dShape[]) {
        let resultObjects: SoftVis3dMesh[] = ObjectFactory.getSceneObjects(shapes);

        // update colors
        for (let index = 0; index < resultObjects.length; index++) {
            this.objectsInView[index].material.color = resultObjects[index].material.color;
        }

        // update selected object
        if (this.selectedTreeObjects.length > 0) {
            let formerSelectedObjectId: string = this.selectedTreeObjects[0].object.getSoftVis3dId();
            this.selectedTreeObjects = [];
            this.selectSceneTreeObject(formerSelectedObjectId);
        }
    }

    public selectSceneTreeObject(objectSoftVis3dId: string | null) {
        // reset former selected objects

        for (let previousSelection of this.selectedTreeObjects) {
            previousSelection.object.material.color.setHex(previousSelection.color);
        }

        this.selectedTreeObjects = [];

        if (objectSoftVis3dId !== null) {
            for (let obj of this.objectsInView) {
                if (objectSoftVis3dId === obj.getSoftVis3dId()) {

                    let selectedObjectMaterial: MeshLambertMaterial = obj.material;

                    let selectedObjectInformation = {
                        object: obj,
                        color: selectedObjectMaterial.color.getHex()
                    };

                    this.selectedTreeObjects.push(selectedObjectInformation);

                    selectedObjectMaterial.color.setHex(0xFFC519);
                }
            }
        }
    }

    public getObjectsInView(): SoftVis3dMesh[] {
        return this.objectsInView;
    }

    public destroy() {
        this.removeAllFromScene();

        this.objectsInView = [];
        this.selectedTreeObjects = [];
    }

    private removeAllFromScene() {
        while (this.objectsInView.length) {
            this.scene.remove(this.objectsInView.pop() as SoftVis3dMesh);
        }
    }

}
