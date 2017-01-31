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

export default class WebGLDetector {

    public static isWebGLSupported(): boolean {
        try {
            let canvas = document.createElement("canvas");
            return !!((window as any).WebGLRenderingContext
                && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
        } catch (e) {
            return false;
        }
    }

    public static getWebGLErrorMessage(): string {
        if (this.isWebGLSupported()) {
            return "";
        }

        if (typeof window !== "undefined" && (window as any).WebGLRenderingContext) {
            return "Your graphics card does not seem to support WebGL. Find out how to get it on http://get.webgl.org/";
        } else {
            return "Your browser does not seem to support WebGL. Find out how to get it on http://get.webgl.org/.";
        }
    }

}