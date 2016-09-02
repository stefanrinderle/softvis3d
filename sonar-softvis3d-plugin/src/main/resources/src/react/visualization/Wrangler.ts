/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */

import {WebGLRenderer, Vector3, MeshLambertMaterial} from "three";
import {ObjectFactory} from "./ObjectFactory";
import {SoftVis3dMesh} from "./domain/SoftVis3dMesh";
import {SoftVis3dShape} from "./domain/SoftVis3dShape";

/**
 * @class This is a resource manager and loads individual models.
 *
 * @struct
 * @constructor
 */
export class Wrangler {

    private context: any;

    private resultObjects: SoftVis3dMesh[] = [];
    private objectsInView: SoftVis3dMesh[] = [];

    private selectedTreeObjects = [];

    constructor(params: WebGLRenderer) {
        this.context = params.context;
    }

    public loadSoftVis3d(data: SoftVis3dShape[]) {
        this.removeAllFromScene();

        this.resultObjects = ObjectFactory.getSceneObjects(data);

        for (let index = 0; index < this.resultObjects.length; index++) {
            let object: SoftVis3dMesh = this.resultObjects[index];
            this.objectsInView.push(object);
            this.context.scene.add(object);
        }
    }

    public selectSceneTreeObject(objectSoftVis3dId: string) {
        // reset former selected objects
        for (let index = 0; index < this.selectedTreeObjects.length; index++) {
            this.selectedTreeObjects[index].object.material.color.setHex(this.selectedTreeObjects[index].color);
        }

        this.selectedTreeObjects = [];

        for (let objectIndex = 0; objectIndex < this.resultObjects.length; objectIndex++) {
            if (objectSoftVis3dId === this.resultObjects[objectIndex].getSoftVis3dId()) {

                let selectedObjectMaterial: MeshLambertMaterial = this.resultObjects[objectIndex].material;
                let selectedObjectInformation = {
                    object: this.resultObjects[objectIndex],
                    color: selectedObjectMaterial.color.getHex()
                };

                this.selectedTreeObjects.push(selectedObjectInformation);
                selectedObjectMaterial.color.setHex(0xFFC519);
            }
        }
    }

    public showAllSceneElements() {
        this.removeAllFromScene();

        for (let resultObjectIndex = 0; resultObjectIndex < this.resultObjects.length; resultObjectIndex++) {
            this.objectsInView.push(this.resultObjects[resultObjectIndex]);
            this.context.scene.add(this.resultObjects[resultObjectIndex]);
        }
    }

    public hideAllSceneElementsExceptIds(showIds) {
        this.hideAllSceneElements();

        for (let index = 0; index < this.resultObjects.length; index++) {
            if (this.contains(showIds, this.resultObjects[index].getSoftVis3dId())) {
                this.objectsInView.push(this.resultObjects[index]);
                this.context.scene.add(this.resultObjects[index]);
            }
        }
    }

    public removeObject(objectSoftVis3dId: string) {
        for (let index = 0; index < this.resultObjects.length; index++) {
            if (objectSoftVis3dId === this.resultObjects[index].getSoftVis3dId()) {
                this.context.scene.remove(this.resultObjects[index]);
            }
        }

        for (let k = 0; k < this.objectsInView.length; k++) {
            if (objectSoftVis3dId === this.objectsInView[k].getSoftVis3dId()) {
                this.objectsInView.splice(k, 1);
            }
        }
    }

    public getVectorProjection(mouseDown, camera) {
        return new Vector3(mouseDown.x, mouseDown.y, 1).unproject(camera);
    }

    private hideAllSceneElements() {
        for (let index = 0; index < this.objectsInView.length; index++) {
            this.context.scene.remove(this.objectsInView[index]);
        }

        this.objectsInView = [];
    }

    private contains(a, obj) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }

    /**
     * Removes the old object from the scene
     */
    private removeAllFromScene() {
        for (let index = 0; index < this.objectsInView.length; index++) {
            this.context.scene.remove(this.objectsInView[index]);
        }

        this.objectsInView = [];
    }

}
