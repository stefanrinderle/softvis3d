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
'use strict';

goog.provide('Viewer.Setup');


/**
 * @class Scene setup.  Most initialization of geometry and managers happen here.
 */
/**
 * Setup the scene geometry
 * @param {Object} params
 * @constructor
 */
Viewer.Setup = function (params) {

  this.context = params.context;

  this.axisHelper = null;

  this.WIDTH = this.context.container.clientWidth;
  this.HEIGHT = this.context.container.clientHeight;

  this.init();
};

/**
 *
 */
Viewer.Setup.prototype = {

  /**
   * Initialize all of the THREE.JS framework
   */
  init: function () {
    this.setupRenderer();
    this.lights();
    this.createGeometry();
    this.context.renderer.setClearColorHex(0xffffff, 1);
  },

  /**
   * Setup the render information.
   */
  setupRenderer: function () {
    this.context.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.context.renderer.setViewport(0, 0, this.WIDTH, this.HEIGHT);
    this.context.jqContainer.fadeIn();
  },

  /**
   * Add light(s) to the scene
   */
  lights: function () {

    var light = new THREE.DirectionalLight(0xaaaaaa);
    light.position.set(1, 0, 0).normalize();
    this.context.scene.add(light);

    light = new THREE.DirectionalLight(0xcccccc);
    light.position.set(-1, 0, 0).normalize();
    this.context.scene.add(light);

    light = new THREE.DirectionalLight(0xddddddd);
    light.position.set(0, 0, 1).normalize();
    this.context.scene.add(light);

    light = new THREE.DirectionalLight(0xeeeeee);
    light.position.set(0, 0, -1).normalize();
    this.context.scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 1, 0);
    this.context.scene.add(light);

  },

  /**
   * Add supporting geometry to the scene.
   */
  createGeometry: function () {
    if (SETUP.SCENE.GROUND) {
      this.createGround();
    }
    if (SETUP.SCENE.GRID) {
      this.createGrid();
    }
  },
  /**
   * Create a floor grid
   */
  createGrid: function () {
    var size = 100, step = 10;
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({color: 'black'});
    for (var i = -size; i <= size; i += step) {
      geometry.vertices.push(new THREE.Vector3(-size, 0.04, i));
      geometry.vertices.push(new THREE.Vector3(size, 0.04, i));
      geometry.vertices.push(new THREE.Vector3(i, 0.04, -size));
      geometry.vertices.push(new THREE.Vector3(i, 0.04, size));
    }
    var line = new THREE.Line(geometry, material, THREE.LinePieces);
    line.name = "grid";
    this.context.scene.add(line);
  },

  createGround: function () {
    var ground;
    var groundMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      ambient: 0x888888,
      shading: THREE.SmoothShading
    });

    ground = new THREE.Mesh(new THREE.PlaneGeometry(1024, 1024), groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.name = "ground";
    this.context.scene.add(ground);
  }
};

