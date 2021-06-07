///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
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

import { computed, observable, observe } from "mobx";
import { Vector3 } from "three";
import { TreeElement } from "../classes/TreeElement";
import { SoftVis3dSelectedObject } from "../components/scene/visualization/objects/SoftVis3dSelectedObject";

export default class SceneStore {
    @observable
    public projectData: TreeElement | null = null;
    @observable
    public selectedTreeObjects: SoftVis3dSelectedObject[] = [];
    @observable
    public selectedObjectKey: string | null = null;
    @observable
    public shapes: any = null;
    @observable
    public shapesHash = "";

    public cameraPosition?: Vector3;
    public scmMetricLoaded: boolean;

    public constructor() {
        this.scmMetricLoaded = false;
        observe(this, "shapes", () => {
            this.shapesHash = Date.now().toString(36);
        });
    }

    @computed
    public get isVisible() {
        return this.shapes !== null;
    }
}
