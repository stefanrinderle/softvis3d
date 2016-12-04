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

import { MeshLambertMaterial, Scene } from "three";
import { ObjectFactory } from "./ObjectFactory";
import { SoftVis3dMesh } from "../domain/SoftVis3dMesh";
import { SoftVis3dShape } from "../domain/SoftVis3dShape";

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

    private resultObjects: SoftVis3dMesh[] = [];
    private objectsInView: SoftVis3dMesh[] = [];

    private selectedTreeObjects: SoftVis3dSelectedObject[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public loadSoftVis3d(data: SoftVis3dShape[]) {
        this.removeAllFromScene();

        this.resultObjects = ObjectFactory.getSceneObjects(data);

        for (let object of this.resultObjects) {
            this.objectsInView.push(object);
            this.scene.add(object);
        }
    }

    public selectSceneTreeObject(objectSoftVis3dId: string | null) {
        // reset former selected objects

        for (let previousSelection of this.selectedTreeObjects) {
            previousSelection.object.material.color.setHex(previousSelection.color);
        }

        this.selectedTreeObjects = [];

        if (objectSoftVis3dId !== null) {
            for (let obj of this.resultObjects) {
                if (objectSoftVis3dId === obj.getSoftVis3dId()) {

                    let selectedObjectMaterial: MeshLambertMaterial = obj.material;
                    let selectedObjectInformation: SoftVis3dSelectedObject = {
                        object: obj,
                        color: selectedObjectMaterial.color.getHex()
                    };

                    this.selectedTreeObjects.push(selectedObjectInformation);
                    selectedObjectMaterial.color.setHex(0xFFC519);
                }
            }
        }
    }

    public showAllSceneElements() {
        this.removeAllFromScene();

        for (let element of this.resultObjects) {
            this.objectsInView.push(element);
            this.scene.add(element);
        }
    }

    public hideAllSceneElementsExceptIds(showIds: string[]) {
        this.hideAllSceneElements();

        for (let element of this.resultObjects) {
            if (showIds.indexOf(element.getSoftVis3dId()) > 0) {
                this.objectsInView.push(element);
                this.scene.add(element);
            }
        }
    }

    public removeObject(objectSoftVis3dId: string) {
        for (let object of this.resultObjects) {
            if (objectSoftVis3dId === object.getSoftVis3dId()) {
                this.scene.remove(object);
            }
        }

        for (let k = 0; k < this.objectsInView.length; k++) {
            if (objectSoftVis3dId === this.objectsInView[k].getSoftVis3dId()) {
                this.objectsInView.splice(k, 1);
            }
        }
    }

    public getObjectsInView(): SoftVis3dMesh[] {
        return this.objectsInView;
    }

    private hideAllSceneElements() {
        for (let objectInView of this.objectsInView) {
            this.scene.remove(objectInView);
        }

        this.objectsInView = [];
    }

    private removeAllFromScene() {
        for (let object of this.objectsInView) {
            this.scene.remove(object);
        }

        this.objectsInView = [];
    }
}
