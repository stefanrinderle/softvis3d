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

import { BoxGeometry, FontLoader, MeshLambertMaterial } from "three";
import { SoftVis3dMesh } from "../../domain/SoftVis3dMesh";
import { SoftVis3dShape } from "../../domain/SoftVis3dShape";
import { TextPlatformObject } from "./TextPlatformObject";
import { TextStreetObject } from "./TextStreetObject";
import { TreeService } from "../../../../services/TreeService";
import sceneStore from "../../../../stores/SceneStore";

export class ObjectFactory {

    // TODO do we need to do this async? Would be better to do it sync on initialization.
    public static loadFonts() {
        this.loader.load("static/resources/fonts/helvetiker_regular.typeface.json", (response) => {
            ObjectFactory.font = response;
        });
    }

    public static getSceneObjects(shapes: SoftVis3dShape[]): SoftVis3dMesh[] {
        let result: SoftVis3dMesh[] = [];

        for (let shape of shapes) {
            result.push(this._getShape(shape));

            if (shape.type === "street") {
                let textMesh: SoftVis3dMesh = new TextStreetObject().create(shape, ObjectFactory.getNameForId(shape.key), this.font);
                result.push(textMesh);
            }

            // TODO color check to be replaced by layout type check
            if (shape.type === "platform" && shape.color !== 14013909) {
                let textMesh: SoftVis3dMesh = new TextPlatformObject().create(shape, ObjectFactory.getNameForId(shape.key), this.font);
                result.push(textMesh);
            }

        }

        return result;
    }

    private static loader = new FontLoader();
    private static font: any;

    private static _getShape(element: SoftVis3dShape): SoftVis3dMesh {
        element.opacity = 1;

        let z = element.position._z + Math.floor(element.dimensions.height / 2);

        let geometry = new BoxGeometry(
            element.dimensions.length,
            element.dimensions.height,
            element.dimensions.width,
            0,
            0,
            0
        );

        let material = new MeshLambertMaterial({
            color: element.color,
            transparent: true,
            opacity: element.opacity
        });

        let cube: SoftVis3dMesh = new SoftVis3dMesh(element.key, geometry, material);
        cube.position.setX(element.position._x);
        cube.position.setY(z);
        cube.position.setZ(element.position._y);

        return cube;
    }

    // TODO this is not good. Add the name to the shape class to be accessible here without any search.
    private static getNameForId(id: string) {
        let text = id;
        if (sceneStore.projectData) {
            let treeElement = TreeService.searchTreeNode(sceneStore.projectData, id);
            if (treeElement) {
                text = treeElement.name;
            }
        }

        return text;
    }

}
