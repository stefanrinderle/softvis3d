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
import { Vector3 } from "three";
import { SoftVis3dShape } from "../domain/SoftVis3dShape";
import { SelectionCalculator } from "./SelectionCalculator";
import { HtmlDom, Offset } from "../../../services/HtmlDom";
import SoftVis3dScene from "./scene/SoftVis3dScene";
import { Wrangler } from "./objects/Wrangler";
import VisualizationOptions from "../../../classes/VisualizationOptions";
import { SceneColorTheme } from "../../../classes/SceneColorTheme";

export default class ThreeSceneService {

    public static create() {
        const softvisScene = new SoftVis3dScene();
        const wrangler = new Wrangler(softvisScene.scene);
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

    private threeScene: SoftVis3dScene;
    private wrangler: Wrangler;

    private lastOptions: VisualizationOptions;

    private constructor(softvis3dScene: SoftVis3dScene, wrangler: Wrangler) {
        this.threeScene = softvis3dScene;
        this.wrangler = wrangler;
    }

    public destroy() {
        this.threeScene.destroy();
        this.wrangler.destroy();
    }

    public update(shapes: SoftVis3dShape[], options: VisualizationOptions, colorTheme: SceneColorTheme, cameraPosition?: Vector3) {
        if (shapes === null) {
            return;
        }

        if (options.equalStructure(this.lastOptions)) {
            if (this.lastOptions.metricColor !== options.metricColor) {
                this.wrangler.updateColorsWithUpdatedShapes(shapes);
            }
        } else {
            this.loadSoftVis3d(shapes, cameraPosition);
        }

        this.threeScene.setColorTheme(colorTheme);

        this.lastOptions = Object.assign({}, options);
    }

    public setColorTheme(colorTheme: SceneColorTheme) {
        this.threeScene.setColorTheme(colorTheme);
    }

    public selectSceneTreeObject(objectSoftVis3dId: string | null) {
        if (this.wrangler) {
            this.wrangler.selectSceneTreeObject(objectSoftVis3dId);
        }
    }

    public getCameraPosition(): Vector3 {
        return this.threeScene.getCameraPosition();
    }

    public makeSelection(event: MouseEvent): string | null {
        const offset: Offset = HtmlDom.getOffsetsById(SoftVis3dScene.CANVAS_ID);
        const selection = SelectionCalculator.calculateSelectionPosition(event, offset);

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
        this.threeScene.resetControls();
        this.setCameraTo(this.threeScene.getDefaultCameraPosition(shapes));
    }

    private loadSoftVis3d(shapes: SoftVis3dShape[], cameraPosition?: Vector3) {
        this.wrangler.loadSoftVis3d(shapes);

        if (!cameraPosition) {
            cameraPosition = this.threeScene.getDefaultCameraPosition(shapes);
        }

        this.threeScene.setCameraTo(cameraPosition);
    }

}
