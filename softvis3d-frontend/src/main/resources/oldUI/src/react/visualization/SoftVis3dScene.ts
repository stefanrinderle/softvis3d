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

import * as jQuery from "jquery";
import {Scene, Projector, WebGLRenderer, Raycaster, Vector3, PerspectiveCamera, Intersection} from "three";
import {Setup} from "./Setup";
import {Camera} from "./Camera";
import {Wrangler} from "./Wrangler";
import {SoftVis3dShape} from "./domain/SoftVis3dShape";
import {SoftVis3dMesh} from "./domain/SoftVis3dMesh";
import {Dimension} from "./domain/Dimension";

export class SoftVis3dScene {

    private container: HTMLCanvasElement;
    private jqContainer: JQuery;

    private width: number;
    private height: number;

    private wrangler: Wrangler;
    private scene: Scene;
    private projector: Projector;
    private renderer: WebGLRenderer;
    private camera: Camera;
    private raycaster: Raycaster;

    constructor(canvasId: string) {
        this.container = <HTMLCanvasElement> document.getElementById(canvasId);
        this.jqContainer = jQuery("#" + canvasId);

        this.width = this.container.width;
        this.height = this.container.height;

        this.scene = new Scene();
        this.projector = new Projector();
        this.renderer = new WebGLRenderer({canvas: this.container, antialias: true, alpha: true});
        this.wrangler = new Wrangler(this.scene);

        Setup.initRenderer(this.renderer, this.scene, this.container, this.jqContainer);

        this.camera = new Camera(this.container);
        this.raycaster = new Raycaster();

        this.onWindowResize();
    }

    public loadSoftVis3d(shapes: SoftVis3dShape[]) {
        this.wrangler.loadSoftVis3d(shapes);
        let platformDimension: Dimension = this.findMaxDimension(shapes);
        this.camera.setCameraPosition(0, platformDimension.length * 0.7, platformDimension.width * 0.7);
    }

    public render() {
        this.renderer.render(this.scene, this.camera.getCamera());
    }

    public setCameraTo(x: number, y: number, z: number) {
        this.camera.setCameraPosition(x, y, z);
    }

    public selectSceneTreeObject(objectSoftVis3dId: string) {
        this.wrangler.selectSceneTreeObject(objectSoftVis3dId);
    }

    public showAllSceneElements() {
        this.wrangler.showAllSceneElements();
    }

    public hideAllSceneElementsExceptIds(showIds: string[]) {
        this.wrangler.hideAllSceneElementsExceptIds(showIds);
    }

    public removeObject(objectSoftVis3dId: string) {
        this.wrangler.removeObject(objectSoftVis3dId);
    }

    public getContainer() {
        return this.container;
    }

    public getCamera(): PerspectiveCamera {
        return this.camera.getCamera();
    }

    public makeSelection(event: MouseEvent): string {
        let canvas: JQuery = jQuery("#content");

        let x: number;
        let y: number;

        if ("offsetX" in event && "offsetY" in event) {
            x = event.offsetX;
            y = event.offsetY;
        } else {
            // Firefox method to get the position
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            x -= canvas.offset().left;
            y -= canvas.offset().top;

            let paddingLeft: string = canvas.css("padding-left").replace("px", "");
            let paddingTop: string = canvas.css("padding-top").replace("px", "");
            x -= Number(paddingLeft);
            y -= Number(paddingTop);
        }

        // creating NDC coordinates for ray intersection.
        let mouseDownX: number = (x / this.width) * 2 - 1;
        let mouseDownY: number = -(y / this.height) * 2 + 1;

        let vector = new Vector3(mouseDownX, mouseDownY, 1).unproject(this.camera.getCamera());

        let cameraPosition = this.camera.getCameraPosition();
        this.raycaster.set(cameraPosition, vector.sub(cameraPosition).normalize());
        let intersected: Intersection[] = this.raycaster.intersectObjects(this.wrangler.getObjectsInView(), true);

        let result: string = null;
        if (intersected.length > 0) {
            let object: SoftVis3dMesh = <SoftVis3dMesh> intersected[0].object;
            let objectSoftVis3dId: string = object.getSoftVis3dId();

            this.selectSceneTreeObject(objectSoftVis3dId);
            result = objectSoftVis3dId;
        }

        return result;
    }

    private findMaxDimension(shapes: SoftVis3dShape[]): Dimension {
        let result: Dimension = {
            length: 0,
            width: 0,
            height: 0
        };
        for (let shape of shapes) {
            if (shape.dimensions.length > result.length) {
                result.length = shape.dimensions.length;
            }
            if (shape.dimensions.width > result.width) {
                result.width = shape.dimensions.width;
            }
            if (shape.dimensions.height > result.height) {
                result.height = shape.dimensions.height;
            }
        }

        return result;
    }

    /**
     * Resizes the camera when document is resized.
     */
    private onWindowResize() {
        let paddingLeft = 20;

        this.width = window.innerWidth - paddingLeft;
        this.height = window.innerHeight - jQuery("#content").position().top - jQuery("#footer").outerHeight();

        this.camera.setAspect(this.width, this.height);

        this.renderer.setSize(this.width, this.height);
        this.renderer.setViewport(0, 0, this.width, this.height);

        let toolbarContainer = document.getElementById("toolbar");
        if (toolbarContainer) {
            jQuery("#toolbar").css("height", this.height);
        }
    }

}