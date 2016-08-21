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
/**
 * @author renej
 * NURBS curve object
 *
 * Derives from Curve, overriding getPoint and getTangent.
 *
 * Implementation is based on (x, y [, z=0 [, w=1]]) control points with w=weight.
 *
 **/


/**************************************************************
 *    NURBS curve
 **************************************************************/

var THREE = require("three");

THREE.NURBSCurve = function (degree, knots /* array of reals */, controlPoints /* array of Vector(2|3|4) */) {

    this.degree = degree;
    this.knots = knots;
    this.controlPoints = [];
    for (var i = 0; i < controlPoints.length; ++i) { // ensure Vector4 for control points
        var point = controlPoints[i];
        this.controlPoints[i] = new THREE.Vector4(point.x, point.y, point.z, point.w);
    }

};


THREE.NURBSCurve.prototype = Object.create(THREE.Curve.prototype);


THREE.NURBSCurve.prototype.getPoint = function (t) {

    var u = this.knots[0] + t * (this.knots[this.knots.length - 1] - this.knots[0]); // linear mapping t->u

    // following results in (wx, wy, wz, w) homogeneous point
    var hpoint = THREE.NURBSUtils.calcBSplinePoint(this.degree, this.knots, this.controlPoints, u);

    if (hpoint.w != 1.0) { // project to 3D space: (wx, wy, wz, w) -> (x, y, z, 1)
        hpoint.divideScalar(hpoint.w);
    }

    return new THREE.Vector3(hpoint.x, hpoint.y, hpoint.z);
};


THREE.NURBSCurve.prototype.getTangent = function (t) {

    var u = this.knots[0] + t * (this.knots[this.knots.length - 1] - this.knots[0]);
    var ders = THREE.NURBSUtils.calcNURBSDerivatives(this.degree, this.knots, this.controlPoints, u, 1);
    var tangent = ders[1].clone();
    tangent.normalize();

    return tangent;
};

