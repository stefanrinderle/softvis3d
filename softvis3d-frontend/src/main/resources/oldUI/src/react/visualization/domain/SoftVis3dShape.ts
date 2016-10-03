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

import {Shape, Vector2} from "three";
import {Dimension} from "./Dimension";
import {Position} from "./Position";

export class SoftVis3dShape extends Shape {

    public key: string;

    public position: Position;
    public dimensions: Dimension;
    public color: number;
    public opacity: number;

    constructor(points: Vector2[], key: string) {
        super(points);

        this.key = key;
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.dimensions = {
            length: 0,
            width: 0,
            height: 0
        };
    }
}