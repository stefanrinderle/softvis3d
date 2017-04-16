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
import {SoftVis3dShape} from "../../domain/SoftVis3dShape";
import {Rectangle} from "../../domain/Rectangle";
import {Offset} from "../../../../services/HtmlDom";

export default class SceneObjectCalculator {

    public static findMaxDimension(shapes: SoftVis3dShape[]): Rectangle {
        let length: number = 0;
        let width: number = 0;

        for (let shape of shapes) {
            if (shape.dimensions.length > length) {
                length = shape.dimensions.length;
            }
            if (shape.dimensions.width > width) {
                width = shape.dimensions.width;
            }
        }

        return new Rectangle(width, length);
    }

    public static calculateDimensionOnResize(sidebarWidth: number, topbarHeight: number, appOffset: Offset,
                                             sonarFooter: HTMLElement | null, appWidth: number): Rectangle {
        const sceneBoarderWidth = 1;
        const sonarFooterHeight = sonarFooter ? sonarFooter.offsetHeight : SceneObjectCalculator.DEFAULT_FOOTER_HEIGHT;
        const appMaxHeight = window.innerHeight - sonarFooterHeight - appOffset.top - (2 * sceneBoarderWidth);
        const appComputedWidth = appWidth - 2 * sceneBoarderWidth;

        let width: number = appComputedWidth - sidebarWidth - 1;
        let height: number = appMaxHeight - topbarHeight;

        return new Rectangle(width, height);
    }

    private static DEFAULT_FOOTER_HEIGHT: number = 11;

}