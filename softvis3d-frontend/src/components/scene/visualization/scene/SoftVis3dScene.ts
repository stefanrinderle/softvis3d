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
import * as three from "three";
import {PerspectiveCamera, Scene, Vector3, WebGLRenderer} from "three";
import {Camera} from "./Camera";
import {Setup} from "./Setup";
import {SoftVis3dShape} from "../../domain/SoftVis3dShape";
import {Dimension} from "../../domain/Dimension";
import {HtmlDom, Offset} from "../../../../services/HtmlDom";
import * as OrbitControlsExtender from "three-orbit-controls";

// tslint:disable-next-line
const OrbitControls: any = OrbitControlsExtender(three);

export default class SoftVis3dScene {
    public static CANVAS_ID: string = "softvis3dscene";

    public readonly scene: Scene;
    public readonly camera: Camera;

    private _width: number;
    private _height: number;

    private renderer: WebGLRenderer;
    private controls: THREE.OrbitControls;

    private animationId: null | number = null;

    public constructor() {
        const container = <HTMLCanvasElement> document.getElementById(SoftVis3dScene.CANVAS_ID);

        this._width = container.width;
        this._height = container.height;

        this.scene = new Scene();
        this.renderer = new WebGLRenderer({canvas: container, antialias: true, alpha: true});

        Setup.initRenderer(this.renderer, this.scene, container);

        this.camera = new Camera(container);

        this.controls = new OrbitControls(this.camera.getCamera(), container);

        this.onWindowResize();

        window.addEventListener("resize", () => {
            this.onWindowResize();
        });

        this.stopAnimation();
        this.startAnimation();
    }

    public setCameraTo(position: Vector3) {
        this.camera.setCameraPosition(position.x, position.y, position.z);
    }

    public getDefaultCameraPosition(shapes: SoftVis3dShape[]) {
        let platformDimension: Dimension = this.findMaxDimension(shapes);
        return new Vector3(0, platformDimension._length * 0.7, platformDimension._width * 0.7);
    }

    public findMaxDimension(shapes: SoftVis3dShape[]): Dimension {
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

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }

    private stopAnimation() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    private startAnimation() {
        if (this.animationId === null) {
            this.animate();
        }
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.getCamera());
    }

    private getCamera(): PerspectiveCamera {
        return this.camera.getCamera();
    }

    /**
     * Resizes the camera when document is resized.
     */
    private onWindowResize() {
        const sidebarWidth = HtmlDom.getWidthById("app-sidebar");
        const topbarHeight = HtmlDom.getHeightById("app-topbar");

        const appOffset: Offset = HtmlDom.getOffsetsById("app");
        const sceneBoarderWidth = 1;
        const sonarFooter = document.getElementById("footer");
        const sonarFooterHeight = sonarFooter ? sonarFooter.offsetHeight : 11;
        const appMaxHeight = window.innerHeight - sonarFooterHeight - appOffset.top - (2 * sceneBoarderWidth);
        const appComputedWidth = HtmlDom.getWidthById("app") - 2 * sceneBoarderWidth;

        this._width = appComputedWidth - sidebarWidth - 1;
        this._height = appMaxHeight - topbarHeight;

        this.camera.setAspect(this._width, this._height);

        this.renderer.setSize(this._width, this._height);
        this.renderer.setViewport(0, 0, this._width, this._height);
    }

}
