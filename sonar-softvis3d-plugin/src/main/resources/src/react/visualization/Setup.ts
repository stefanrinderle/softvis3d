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

import {WebGLRenderer, DirectionalLight} from "three";

/**
 * TODO: Write tests with sinon mocks.
 */
export class Setup {

    public static initRenderer(params: WebGLRenderer) {
        let context: any = params.context;
        let width: number = context.container.clientWidth;
        let height: number = context.container.clientHeight;

        Setup.setupRenderer(params.context, width, height);
        Setup.lights(params.context);

        context.renderer.setClearColor(0x000000, 1);
    }

    /**
     * Setup the render information.
     */
    private static setupRenderer(context: any, width: number, height: number) {
        context.renderer.setSize(width, height);
        context.renderer.setViewport(0, 0, width, height);
        context.jqContainer.fadeIn();
    }

    /**
     * Add light(s) to the scene
     */
    private static lights(context: any) {
        let light = new DirectionalLight(0xaaaaaa);
        light.position.set(1, 0, 0).normalize();
        context.scene.add(light);

        light = new DirectionalLight(0xcccccc);
        light.position.set(-1, 0, 0).normalize();
        context.scene.add(light);

        light = new DirectionalLight(0xddddddd);
        light.position.set(0, 0, 1).normalize();
        context.scene.add(light);

        light = new DirectionalLight(0xeeeeee);
        light.position.set(0, 0, -1).normalize();
        context.scene.add(light);

        light = new DirectionalLight(0xffffff);
        light.position.set(0, 1, 0);
        context.scene.add(light);
    }

}
