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

import {expect} from "chai";
import {Vector2} from "three";
import {Dimension} from "../../../../../src/components/scene/domain/Dimension";
import {Rectangle} from "../../../../../src/components/scene/domain/Rectangle";
import {SoftVis3dShape} from "../../../../../src/components/scene/domain/SoftVis3dShape";
import SceneObjectCalculator from "../../../../../src/components/scene/visualization/scene/SceneObjectCalculator";
import {Offset} from "../../../../../src/services/HtmlDomService";

describe("SceneObjectCalculator", () => {

    it("should calc with empty shape array", () => {
        const shapes: SoftVis3dShape[] = [];
        const result: Rectangle = SceneObjectCalculator.findMaxDimension(shapes);

        expect(result.length).to.be.eq(0);
        expect(result.width).to.be.eq(0);
    });

    it("should calc with single shape in array", () => {
        const shapes: SoftVis3dShape[] = [];
        const points: Vector2[] = [];
        points.push(new Vector2(12, 54));
        const shape: SoftVis3dShape = new SoftVis3dShape(points, "1");
        shape.dimensions = new Dimension(23, 56, 89);
        shapes.push(shape);
        const result: Rectangle = SceneObjectCalculator.findMaxDimension(shapes);

        expect(result.length).to.be.eq(56);
        expect(result.width).to.be.eq(23);
    });

    it("should find max width and length", () => {
        const shapes: SoftVis3dShape[] = [];
        const points: Vector2[] = [];
        points.push(new Vector2(12, 54));
        const shape: SoftVis3dShape = new SoftVis3dShape(points, "1");
        shape.dimensions = new Dimension(1, 3453, 89);
        shapes.push(shape);
        const shape2: SoftVis3dShape = new SoftVis3dShape(points, "1");
        shape2.dimensions = new Dimension(2332, 56, 1);
        shapes.push(shape2);
        const result: Rectangle = SceneObjectCalculator.findMaxDimension(shapes);

        expect(result.length).to.be.eq(3453);
        expect(result.width).to.be.eq(2332);
    });

    it("should calc dimension on resize", () => {
        const sidebarWidth = 12;
        const topbarHeight = 34;

        const appOffset: Offset = new Offset(56, 78);
        const sonarFooter: any = {
            offsetHeight: 74
        };
        const appWidth = 90;

        const result = SceneObjectCalculator.calculateDimensionOnResize(sidebarWidth, topbarHeight, appOffset, sonarFooter, appWidth);

        expect(result.length).to.be.eq(602);
        expect(result.width).to.be.eq(75);
    });

});