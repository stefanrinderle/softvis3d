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
  createObjects: function (platformArray) {
    var result = [];

    for (var i = 0; i < platformArray.length; i++) {
      var platformResult = this.createPlatform(platformArray[i]);
      result = result.concat(platformResult);
    }

    return result;
  },

  createPlatform: function (platform) {
    var result = [];

    var position = [];
    position.x = platform.positionX;
    position.y = platform.height3d;
    position.z = platform.positionY;

    var geometryLayer = new THREE.BoxGeometry(
        platform.width, platform.platformHeight, platform.height);

    var layerMaterial = new THREE.MeshLambertMaterial({
      color: platform.color,
      transparent: true,
      opacity: platform.opacity
    });

    result.push(this.createBox(geometryLayer, layerMaterial, position, platform.platformId, "node"));

    for (var i = 0; i < platform.nodes.length; i++) {
      var buildingResult = this.createBuilding(platform.nodes[i]);
      result = result.concat(buildingResult);
    }

    return result;
  },

  createBuilding: function (building) {
    var result = [];

    var nodeMaterial = new THREE.MeshLambertMaterial({
      color: building.color,
      transparent: true,
      opacity: 1
    });

    var nodeGeometry = new THREE.BoxGeometry(
        building.width, building.buildingHeight, building.height);

    var position = [];
    position.x = building.positionX;
    position.y = building.height3d + building.buildingHeight / 2;
    position.z = building.positionY;

    result.push(this.createBox(nodeGeometry, nodeMaterial, position, building.id, "leaf"));

    return result;
  },

  createBox: function (geometry, material, position, id, type) {
    var object = new THREE.Mesh(geometry, material);

    object.position.x = position.x;
    object.position.y = position.y;
    object.position.z = position.z;

    object.softVis3dId = id;
    object.softVis3dType = type;

    return object;
  },

  createVectorFromPoint: function (point) {
    return new THREE.Vector3(point.x, point.y, point.z);
  }
};