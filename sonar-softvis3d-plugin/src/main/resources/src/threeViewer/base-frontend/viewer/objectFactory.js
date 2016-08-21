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
    /*
     * SoftVis3D Sonar plugin
     * Copyright (C) 2014 Stefan Rinderle
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

    var THREE = require("three");
    var Viewer = require('./viewer.js');

    Viewer.ObjectFactory = function (params) {
      this.context = params.context;
    };

    Viewer.ObjectFactory.prototype = {

      getSceneObjects(illu) {
        var result = [];

        for (var shape of illu.shapes) {
          result.push(this._getShape(shape));
        }

        return result;
      },

      _getShape (element) {
        var defaults = {
          position: {x: 0, y: 0, z: 0},
          dimensions: {length: 1, width: 1, height: 1},
          color: 0x000000,
          opacity: 1
        };

        for (var attr in element) {
          defaults[attr] = element[attr];
        }
        var z = defaults.position.z + Math.floor(defaults.dimensions.height / 2);

        var geometry = new THREE.BoxGeometry(
            defaults.dimensions.length,
            defaults.dimensions.height,
            defaults.dimensions.width,
            0,
            0,
            0
        );

        var material = new THREE.MeshLambertMaterial({
          color: defaults.color,
          transparent: true,
          opacity: defaults.opacity
        });

        var cube = new THREE.Mesh(geometry, material);
        cube.position.setX(defaults.position.x);
        cube.position.setY(z);
        cube.position.setZ(defaults.position.y);

        cube.softVis3dId = element.key;
        return cube;
      }
    };