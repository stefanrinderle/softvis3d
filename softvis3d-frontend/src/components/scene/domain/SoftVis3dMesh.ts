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

import { Mesh, Geometry, MeshLambertMaterial } from "three";

export class SoftVis3dMesh extends Mesh {

    /**
     * @Override material from Mesh
     *
     * package private in Mesh, public here.
     * Override to provide MeshLambertMaterial instead of Material
     */
    public material: MeshLambertMaterial;

    private softVis3dId: string;

    constructor(softVis3dId: string, geometry: Geometry, material: MeshLambertMaterial) {
        super(geometry, material);

        this.material = material;
        this.softVis3dId = softVis3dId;
    }

    public getSoftVis3dId(): string {
        return this.softVis3dId;
    }

}