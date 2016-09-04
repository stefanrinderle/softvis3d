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

import {Scene, Projector, WebGLRenderer, Raycaster, Vector3, PerspectiveCamera} from "three";

import {Setup} from "./Setup";
import {Camera} from "./Camera";
import {Wrangler} from "./Wrangler";

export class SoftVis3dScene {

    private container: any;
    private jqContainer: any;

    private width: number;
    private height: number;

    private wrangler: Wrangler;
    private scene: Scene;
    private projector: Projector;
    private renderer: WebGLRenderer;
    private camera: Camera;
    private raycaster: Raycaster;

    constructor(canvasId: string) {
        this.container = document.getElementById(canvasId);
        this.jqContainer = jQuery("#" + canvasId);

        this.width = this.container.width;
        this.height = this.container.height;

        this.scene = new Scene();
        this.projector = new Projector();
        this.renderer = new WebGLRenderer({canvas: this.container, antialias: true, alpha: true});
        this.wrangler = new Wrangler(this.scene);

        Setup.initRenderer(this.renderer, this.scene, this.container, this.jqContainer);

        this.camera = new Camera(this.container, this.scene);
        this.raycaster = new Raycaster();

        this.onWindowResize();
    }

    public loadSoftVis3d(data) {
        this.wrangler.loadSoftVis3d(data);
    }

    public render() {
        this.renderer.render(this.scene, this.camera.getCamera());
    }

    public selectSceneTreeObject(objectSoftVis3dId) {
        this.wrangler.selectSceneTreeObject(objectSoftVis3dId);
    }

    public showAllSceneElements() {
        this.wrangler.showAllSceneElements();
    }

    public hideAllSceneElementsExceptIds(showIds) {
        this.wrangler.hideAllSceneElementsExceptIds(showIds);
    }

    public removeObject(objectSoftVis3dId) {
        this.wrangler.removeObject(objectSoftVis3dId);
    }

    public getContainer() {
        return this.container;
    }

    public getCamera(): PerspectiveCamera {
        return this.camera.getCamera();
    }

    /**
     * See if a mouse click intersects an object.
     * @param {!{x:number, y:number}} mouse
     */
    public makeSelection(event: any): string {
        let canvas: any = jQuery("#content");

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

            x -= canvas.css("padding-left").replace("px", "");
            y -= canvas.css("padding-top").replace("px", "");
        }

        let width = this.width;
        let height = this.height;

        // creating NDC coordinates for ray intersection.
        let mouseDown: any = {};
        mouseDown.x = (x / width) * 2 - 1;
        mouseDown.y = -(y / height) * 2 + 1;

        let vector = new Vector3(mouseDown.x, mouseDown.y, 1).unproject(this.camera.getCamera());

        let cameraPosition = this.camera.getCameraPosition();
        this.raycaster.set(cameraPosition, vector.sub(cameraPosition).normalize());
        let intersected: any = this.raycaster.intersectObjects(this.wrangler.getObjectsInView(), true);

        let result: string = null;
        if (intersected.length > 0) {
            let objectSoftVis3dId: string = intersected[0].object.softVis3dId;

            this.selectSceneTreeObject(objectSoftVis3dId);
            result = objectSoftVis3dId;
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