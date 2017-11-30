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

import { DirectionalLight, Scene, WebGLRenderer } from "three";

export class Setup {

    public static initRenderer(renderer: WebGLRenderer, scene: Scene, container: HTMLCanvasElement) {
        let width: number = container.clientWidth;
        let height: number = container.clientHeight;

        Setup.setupRenderer(renderer, width, height);
        Setup.lights(scene);
    }

    /**
     * Setup the render information.
     */
    private static setupRenderer(renderer: WebGLRenderer, width: number, height: number) {
        renderer.setSize(width, height);
        renderer.setViewport(0, 0, width, height);
    }

    /**
     * Add light(s) to the scene
     */
    private static lights(scene: Scene) {
        let light = new DirectionalLight(0xaaaaaa);
        light.position.set(1, 0, 0).normalize();
        scene.add(light);

        light = new DirectionalLight(0xcccccc);
        light.position.set(-1, 0, 0).normalize();
        scene.add(light);

        light = new DirectionalLight(0xddddddd);
        light.position.set(0, 0, 1).normalize();
        scene.add(light);

        light = new DirectionalLight(0xeeeeee);
        light.position.set(0, 0, -1).normalize();
        scene.add(light);

        light = new DirectionalLight(0xffffff);
        light.position.set(0, 1, 0);
        scene.add(light);
    }
}
