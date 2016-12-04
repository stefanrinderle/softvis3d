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
import {Scene, WebGLRenderer, PerspectiveCamera} from "three";
import {Camera} from "./Camera";
import {Wrangler} from "./Wrangler";
import {Setup} from "./Setup";
import {SoftVis3dShape} from "../domain/SoftVis3dShape";
import {Dimension} from "../domain/Dimension";
import {OrbitControls} from "./controls/OrbitControls";
import {SelectionService} from "./SelectionCalculator";

export class SoftVis3dScene {

    private container: HTMLCanvasElement;

    private width: number;
    private height: number;

    private wrangler: Wrangler;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private camera: Camera;
    private controls: OrbitControls;

    constructor(canvasId: string) {
        this.container = <HTMLCanvasElement> document.getElementById(canvasId);

        this.width = this.container.width;
        this.height = this.container.height;

        this.scene = new Scene();
        this.renderer = new WebGLRenderer({canvas: this.container, antialias: true, alpha: true});
        this.wrangler = new Wrangler(this.scene);

        Setup.initRenderer(this.renderer, this.scene, this.container);

        this.camera = new Camera(this.container);

        this.controls = new OrbitControls(this.camera.getCamera(), this.container);

        this.onWindowResize();

        window.addEventListener("resize", () => {
            this.onWindowResize();
        });
    }

    public loadSoftVis3d(shapes: SoftVis3dShape[]) {
        this.wrangler.loadSoftVis3d(shapes);
        let platformDimension: Dimension = this.findMaxDimension(shapes);
        this.camera.setCameraPosition(0, platformDimension._length * 0.7, platformDimension._width * 0.7);
    }

    public render() {
        this.renderer.render(this.scene, this.camera.getCamera());
    }

    public setCameraTo(x: number, y: number, z: number) {
        this.camera.setCameraPosition(x, y, z);
    }

    public selectSceneTreeObject(objectSoftVis3dId: string | null) {
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

    /**
     * Resizes the camera when document is resized.
     */
    public onWindowResize() {
        // TODO: Change for Sidebar
        const sidebarWidth = 0;
        const appOffset = this.getOffsetsById("app");
        const sceneBoarderWidth = 1;
        const sonarFooterPosition =  this.getOffsetsById("footer");
        const sonarFooterHeight = sonarFooterPosition.top ? window.innerHeight - sonarFooterPosition.top : 11;
        const appMaxHeight = window.innerHeight - sonarFooterHeight - appOffset.top - (2 * sceneBoarderWidth);
        const appMaxWidth = window.innerWidth - (appOffset.left + sceneBoarderWidth) * 2;

        this.width = appMaxWidth - sidebarWidth;
        this.height = appMaxHeight;

        this.camera.setAspect(this.width, this.height);

        this.renderer.setSize(this.width, this.height);
        this.renderer.setViewport(0, 0, this.width, this.height);
    }

    public makeSelection(event: MouseEvent): string | null {
        // TODO: Remove commented code
        // console.debug(this.controls.state);

        let result: string | null = SelectionService.makeSelection(event, this.container, this.width, this.height,
            this.camera, this.wrangler.getObjectsInView());

        this.selectSceneTreeObject(result);

        return result;
    }

    private getOffsetsById(id: string): { top: number; left: number; } {
        let node = document.getElementById(id);
        let top = 0;
        let left = 0;
        let topScroll = 0;
        let leftScroll = 0;
        if (node && node.offsetParent) {
            do {
                top += node.offsetTop;
                left += node.offsetLeft;
                topScroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
                leftScroll += node.offsetParent ? node.offsetParent.scrollLeft : 0;
            } while (node = node.offsetParent as HTMLElement);
        }

        return {
            top: top - topScroll,
            left: left - leftScroll
        };
    }

    private findMaxDimension(shapes: SoftVis3dShape[]): Dimension {
        let result: Dimension = {
            _length: 0,
            _width: 0,
            _height: 0
        };
        for (let shape of shapes) {
            if (shape.dimensions._length > result._length) {
                result._length = shape.dimensions._length;
            }
            if (shape.dimensions._width > result._width) {
                result._width = shape.dimensions._width;
            }
            if (shape.dimensions._height > result._height) {
                result._height = shape.dimensions._height;
            }
        }

        return result;
    }

}