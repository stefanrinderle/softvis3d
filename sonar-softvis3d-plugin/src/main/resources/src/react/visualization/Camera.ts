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

import {PerspectiveCamera, Vector3, Scene} from "three";

/**
 * @class Creates the camera for the scene.
 */
export class Camera {

    private fov: number = 70;

    private aspectRatio: number;

    /**
     * Perspective camera setup
     */
    private perpCam: PerspectiveCamera = null;
    private perpNearPane: number = 1;
    private perpFarPane: number = 100000;

    constructor(container: HTMLCanvasElement, scene: Scene) {
        this.aspectRatio = container.clientWidth / container.clientHeight;

        this.initPerspective(scene);
    }

    public getCamera(): PerspectiveCamera {
        return this.perpCam;
    }

    public getCameraPosition(): Vector3 {
        return this.perpCam.position;
    }

    public setAspect(width: number, height: number) {
        this.perpCam.aspect = width / height;
        this.perpCam.updateProjectionMatrix();
    }

    /**
     * Initialize the perspective camera.
     */
    private initPerspective(scene: Scene) {
        this.perpCam = new PerspectiveCamera
        (
            this.fov,
            this.aspectRatio,
            this.perpNearPane,
            this.perpFarPane
        );

        this.perpCam.position.y = 800;
        this.perpCam.position.z = 1400;
        this.perpCam.lookAt(scene.position);
        this.perpCam.name = "perp";
    }

    // private setCameraPosition(positionX, positionY, positionZ) {
    //     this.perpCam.position.x = positionX;
    //     this.perpCam.position.y = positionY;
    //     this.perpCam.position.z = positionZ;
    //     this.perpCam.lookAt(this.context.scene.position);
    // }
}