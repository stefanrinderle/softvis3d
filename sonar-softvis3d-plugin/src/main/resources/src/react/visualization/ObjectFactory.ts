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

import {MeshLambertMaterial, BoxGeometry} from "three";
import {SoftVis3dMesh} from "./domain/SoftVis3dMesh";
import {SoftVis3dShape} from "./domain/SoftVis3dShape";

export class ObjectFactory {

    public static getSceneObjects(shapes: SoftVis3dShape[]): SoftVis3dMesh[] {
        let result: SoftVis3dMesh[] = [];

        for (let shape of shapes) {
            result.push(this._getShape(shape));
        }

        return result;
    }

    private static _getShape(element: SoftVis3dShape): SoftVis3dMesh {
        let defaults: any = {
            position: {x: 0, y: 0, z: 0},
            dimensions: {length: 1, width: 1, height: 1},
            color: 0x000000,
            opacity: 1
        };

        for (let attr in element) {
            if (element.hasOwnProperty(attr)) {
                defaults[attr] = element[attr];
            }
        }

        let z = defaults.position.z + Math.floor(defaults.dimensions.height / 2);

        let geometry = new BoxGeometry(
            defaults.dimensions.length,
            defaults.dimensions.height,
            defaults.dimensions.width,
            0,
            0,
            0
        );

        let material = new MeshLambertMaterial({
            color: defaults.color,
            transparent: true,
            opacity: defaults.opacity
        });

        let cube: SoftVis3dMesh = new SoftVis3dMesh(element.key, geometry, material);
        cube.position.setX(defaults.position.x);
        cube.position.setY(z);
        cube.position.setZ(defaults.position.y);

        return cube;
    }
}