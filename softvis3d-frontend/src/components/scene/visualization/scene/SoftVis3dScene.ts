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
import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { Camera } from "./Camera";
import { Setup } from "./Setup";
import { SoftVis3dShape } from "../../domain/SoftVis3dShape";
import { Rectangle } from "../../domain/Rectangle";
import { HtmlDom, Offset } from "../../../../services/HtmlDom";
import * as OrbitControlsExtender from "three-orbit-controls";
import SceneObjectCalculator from "./SceneObjectCalculator";
import { SceneColorTheme } from "../../../../classes/SceneColorTheme";

const OrbitControls = OrbitControlsExtender(three);

export default class SoftVis3dScene {
    public static CANVAS_ID: string = "softvis3dscene";

    public readonly scene: Scene;
    public readonly camera: Camera;

    private _width: number;
    private _height: number;

    private renderer: WebGLRenderer;
    private controls: any;

    private animationId: null | number = null;

    public constructor() {
        const container = document.getElementById(SoftVis3dScene.CANVAS_ID) as HTMLCanvasElement;

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

    public destroy() {
        this.stopAnimation();
    }

    public setColorTheme(colorTheme: SceneColorTheme) {
        this.renderer.setClearColor(colorTheme.backgroundColor, 1);
    }

    public setCameraTo(position: Vector3) {
        this.camera.setCameraPosition(position.x, position.y, position.z);
    }

    public getCamera(): PerspectiveCamera {
        return this.camera.getCamera();
    }

    public getCameraPosition(): Vector3 {
        return this.camera.getCameraPosition();
    }

    public getDefaultCameraPosition(shapes: SoftVis3dShape[]): Vector3 {
        let platform: Rectangle = SceneObjectCalculator.findMaxDimension(shapes);
        return new Vector3(0, platform.length * 0.7, platform.width * 0.7);
    }

    public resetControls() {
        this.controls.reset();
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }

    private stopAnimation() {
        if (this.animationId !== null) {
            window.cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    private startAnimation() {
        if (this.animationId === null) {
            this.animate();
        }
    }

    private animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.getCamera());
    }

    /**
     * Resizes the camera when document is resized.
     */
    private onWindowResize() {
        const sidebarWidth = HtmlDom.getWidthById("app-sidebar");
        const topbarHeight = HtmlDom.getHeightById("app-topbar");

        const appOffset: Offset = HtmlDom.getOffsetsById("app");
        const sonarFooter = document.getElementById("footer");
        const appWidth = HtmlDom.getWidthById("app");

        let result: Rectangle = SceneObjectCalculator.calculateDimensionOnResize(
            sidebarWidth, topbarHeight, appOffset, sonarFooter, appWidth);

        this.camera.setAspect(result.width, result.length);

        this.renderer.setSize(result.width, result.length);
        this.renderer.setViewport(0, 0, result.width, result.length);

        this._width = result.width;
        this._height = result.length;
    }

}