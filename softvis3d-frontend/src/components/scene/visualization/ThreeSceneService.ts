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
import {Vector3} from "three";
import {SoftVis3dShape} from "../domain/SoftVis3dShape";
import {SelectionCalculator} from "./SelectionCalculator";
import {HtmlDom, Offset} from "../../../services/HtmlDom";
import SoftVis3dScene from "./scene/SoftVis3dScene";
import {Wrangler} from "./objects/Wrangler";

export default class ThreeSceneService {

    private threeScene: SoftVis3dScene;
    private wrangler: Wrangler;

    public static create() {
        const softvisScene = new SoftVis3dScene();
        const wrangler= new Wrangler(softvisScene.scene);
        return new ThreeSceneService(
            softvisScene,
            wrangler
        );
    }

    public static createForTest(softvis3dSceneMock: SoftVis3dScene, wranglerMock: Wrangler) {
        return new ThreeSceneService(
            softvis3dSceneMock,
            wranglerMock
        );
    }

    private constructor(softvis3dScene: SoftVis3dScene, wrangler: Wrangler) {
        this.threeScene = softvis3dScene;
        this.wrangler = wrangler;
    }

    public update(shapes: SoftVis3dShape[], sceneComponentIsMounted: boolean, colorsChanged: boolean, cameraPosition?: Vector3) {
        if (shapes !== null && sceneComponentIsMounted) {
            if (colorsChanged) {
                this.wrangler.updateColorsWithUpdatedShapes(shapes);
            }

            this.loadSoftVis3d(shapes, cameraPosition);
        }
    }

    public selectSceneTreeObject(objectSoftVis3dId?: string | null) {
        if (this.wrangler && objectSoftVis3dId) {
            this.wrangler.selectSceneTreeObject(objectSoftVis3dId);
        }
    }

    public getCameraPosition(): Vector3 {
        return this.threeScene.getCameraPosition();
    }

    public makeSelection(event: MouseEvent): string | null {
        const selection = this.calculateSelectionPosition(event);

        let result: string | null = SelectionCalculator.makeSelection(
            selection.x, selection.y,
            this.threeScene.width, this.threeScene.height,
            this.threeScene.getCamera(), this.wrangler.getObjectsInView()
        );

        this.selectSceneTreeObject(result);

        return result;
    }

    public setCameraTo(position: Vector3) {
        this.threeScene.setCameraTo(position);
    }

    /**
     * Why recalculate?
     * I want the position to be reset based on the given shapes. In the use case of the "direct link" feature,
     * reset to the "first" position would reset to the starting point from the link.
     */
    public resetCameraPosition(shapes: SoftVis3dShape[]) {
        this.setCameraTo(this.threeScene.getDefaultCameraPosition(shapes));
    }

    private loadSoftVis3d(shapes: SoftVis3dShape[], cameraPosition?: Vector3) {
        this.wrangler.loadSoftVis3d(shapes);

        if (!cameraPosition) {
            cameraPosition = this.threeScene.getDefaultCameraPosition(shapes);
        }

        this.threeScene.setCameraTo(cameraPosition);
    }

    private calculateSelectionPosition(event: MouseEvent) {
        let x: number = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        let y: number = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;

        const offset: Offset = HtmlDom.getOffsetsById(SoftVis3dScene.CANVAS_ID);
        x -= offset.left;
        y -= offset.top;

        return {x, y};
    }
}
