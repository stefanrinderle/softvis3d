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
goog.provide('Viewer.Util');

/**
 * @namespace  General untility functions.
 */
Viewer.Util = {

  /**
   *  Create a random color
   */
  randomHex: function () {
    return ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
  },

  /**
   *   Change a group of meshes to random colors.
   *   @param {THREE.Mesh} mesh Cube mesh.
   */
  changeColor: function (mesh) {

    var rand = parseInt('0x' + this.randomHex(), 16);
    mesh.object.material.color.setHex(rand);

  },

  randomColor: function () {
    return parseInt('0x' + this.randomHex(), 16);
  },

  randomInt: function (max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  supportsWebGL: function () {
    try {
      return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
    } catch (e) {
      return false;
    }
  }


};

