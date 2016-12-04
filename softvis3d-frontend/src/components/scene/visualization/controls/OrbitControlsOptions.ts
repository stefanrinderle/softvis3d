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

export class OrbitControlsOptions {
    // Set to false to disable this control
    public enabled: boolean = true;

    // How far you can dolly in and out ( PerspectiveCamera only )
    public minDistance: number = -Infinity;
    public maxDistance: number = Infinity;

    // How far you can zoom in and out ( OrthographicCamera only )
    public minZoom: number = -Infinity;
    public maxZoom: number = Infinity;

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    public minPolarAngle: number = 0; // radians
    public maxPolarAngle: number = Math.PI; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    public minAzimuthAngle: number = -Infinity; // radians
    public maxAzimuthAngle: number = Infinity; // radians

    // Set to true to enable damping (inertia)
    // If damping is enabled, you must call controls.update() in your animation loop
    public enableDamping: boolean = false;
    public dampingFactor: number = 0.25;

    // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
    // Set to false to disable zooming
    public enableZoom: boolean = true;
    public zoomSpeed: number = 1.5;

    // Set to false to disable rotating
    public enableRotate: boolean = true;
    public rotateSpeed: number = 1.0;

    // Set to false to disable panning
    public enablePan: boolean = true;
    public keyPanSpeed: number = 7.0;	// pixels moved per arrow key push

    // Set to true to automatically rotate around the target
    // If auto-rotate is enabled, you must call controls.update() in your animation loop
    public autoRotate: boolean = false;
    public autoRotateSpeed: number = 2.0; // 30 seconds per round when fps is 60

    // Set to false to disable use of the keys
    public enableKeys: boolean = true;
}