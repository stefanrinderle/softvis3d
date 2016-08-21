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
'use strict';

var THREE = require("three");
var Viewer = require('./viewer.js');

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
    this.context.renderer.setClearColor(0xffffff, 1);
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

  }

};

