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
import {Scene, WebGLRenderer, PerspectiveCamera, Vector3} from "three";
import {Camera} from "./Camera";
import {Wrangler} from "./Wrangler";
import {Setup} from "./Setup";
import {SoftVis3dShape} from "../domain/SoftVis3dShape";
import {Dimension} from "../domain/Dimension";
import {SelectionService} from "./SelectionCalculator";
import HtmlDom from "../../../services/HtmlDom";

export default class SoftVis3dScene {
    public static CANVAS_ID: string = "softvis3dscene";

    private width: number;
    private height: number;

    private wrangler: Wrangler;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private camera: Camera;
    private controls: THREE.OrbitControls;

    private animationId: null | number = null;

    public init() {
        const container = <HTMLCanvasElement> document.getElementById(SoftVis3dScene.CANVAS_ID);

        this.width = container.width;
        this.height = container.height;

        this.scene = new Scene();
        this.renderer = new WebGLRenderer({canvas: container, antialias: true, alpha: true});
        this.wrangler = new Wrangler(this.scene);

        Setup.initRenderer(this.renderer, this.scene, container);

        this.camera = new Camera(container);

        this.controls = new THREE.OrbitControls(this.camera.getCamera(), container);

        this.onWindowResize();

        window.addEventListener("resize", () => {
            this.onWindowResize();
        });

        this.stopAnimation();
        this.startAnimation();
    }

    public stopAnimation() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    public startAnimation() {
        if (this.animationId === null) {
            this.animate();
        }
    }

    public animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.getCamera());
    }

    public loadSoftVis3d(shapes: SoftVis3dShape[], cameraPosition?: Vector3) {
        this.wrangler.loadSoftVis3d(shapes);

        if (!cameraPosition) {
            cameraPosition = this.getDefaultCameraPosition(shapes);
        }

        this.setCameraTo(cameraPosition);
    }

    public updateColorsWithUpdatedShapes(shapes: SoftVis3dShape[]) {
        this.wrangler.updateColorsWithUpdatedShapes(shapes);
    }

    public setCameraTo(position: Vector3) {
        this.camera.setCameraPosition(position.x, position.y, position.z);
    }

    public selectSceneTreeObject(objectSoftVis3dId: string | null) {
        if (this.wrangler) {
            this.wrangler.selectSceneTreeObject(objectSoftVis3dId);
        }
    }

    public getCamera(): PerspectiveCamera {
        return this.camera.getCamera();
    }

    /**
     * Resizes the camera when document is resized.
     */
    public onWindowResize() {
        const sidebarWidth = HtmlDom.getWidthById("app-sidebar");
        const topbarHeight = HtmlDom.getHeightById("app-topbar");

        const appOffset = HtmlDom.getOffsetsById("app");
        const sceneBoarderWidth = 1;
        const sonarFooter = document.getElementById("footer");
        const sonarFooterHeight = sonarFooter ? sonarFooter.offsetHeight : 11;
        const appMaxHeight = window.innerHeight - sonarFooterHeight - appOffset.top - (2 * sceneBoarderWidth);
        const appComputedWidth = HtmlDom.getWidthById("app") - 2 * sceneBoarderWidth;

        this.width = appComputedWidth - sidebarWidth - 1;
        this.height = appMaxHeight - topbarHeight;

        this.camera.setAspect(this.width, this.height);

        this.renderer.setSize(this.width, this.height);
        this.renderer.setViewport(0, 0, this.width, this.height);
    }

    public makeSelection(event: MouseEvent): string | null {
        const selection = this.calculateSelectionPosition(event);

        let result: string | null = SelectionService.makeSelection(
            selection.x, selection.y,
            this.width, this.height,
            this.camera, this.wrangler.getObjectsInView()
        );

        this.selectSceneTreeObject(result);

        return result;
    }

    /**
     * Why recalculate?
     * I want the position to be reset based on the given shapes. In the use case of the "direct link" feature,
     * reset to the "first" position would reset to the starting point from the link.
     */
    public resetCameraPosition(shapes: SoftVis3dShape[]) {
        this.setCameraTo(this.getDefaultCameraPosition(shapes));
    }

    private calculateSelectionPosition(event: MouseEvent) {
        let x: number = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        let y: number = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;

        const offset = HtmlDom.getOffsetsById(SoftVis3dScene.CANVAS_ID);
        x -= offset.left;
        y -= offset.top;

        return {x, y};
    }

    private getDefaultCameraPosition(shapes: SoftVis3dShape[]) {
        let platformDimension: Dimension = this.findMaxDimension(shapes);
        return new Vector3(0, platformDimension._length * 0.7, platformDimension._width * 0.7);
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
