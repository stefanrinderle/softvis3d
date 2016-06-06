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
var jQuery = require("jquery");
var THREE = require("three");
var OrbitControls = require('three-orbit-controls')(THREE);
var Viewer = require('./viewer.js');

Viewer.Scene = function (params) {

  this.container = document.getElementById(params.canvasId);
  this.jqContainer = jQuery('#' + params.canvasId);

  this.context = params.context;

  this.WIDTH = this.container.width;
  this.HEIGHT = this.container.height;

  this.wrangler = null;
  this.scene = null;
  this.projector = null;
  this.renderer = null;
  this.setup = null;
  this.cameras = null;
  this.controls = null;
  this.raycaster = null;

  this.objectFactory = null;

  this.init();

};

Viewer.Scene.prototype = {

  init: function () {

    var params = {context: this};

    this.scene = new THREE.Scene();
    this.projector = new THREE.Projector();
    this.renderer = new THREE.WebGLRenderer({canvas: this.container, antialias: true, alpha: true});
    this.wrangler = new Viewer.Wrangler(params);
    this.setup = new Viewer.Setup(params);
    this.cameras = new Viewer.Cameras(params);
    this.controls = new OrbitControls(this.cameras.liveCam, this.container);
    this.raycaster = new THREE.Raycaster();
    this.wrangler.init();

    this.objectFactory = new Viewer.ObjectFactory(params);

    this.listeners();
    this.onWindowResize();
  },


  listeners: function () {
    var to = null;
    window.addEventListener('resize', function () {

      // if timeout already set, clear it so you can set a new one
      // this prevents N resize events from resizing the canvas
      if (to) {
        clearTimeout(to);
      }
      to = setTimeout(function () {
        this.onWindowResize();
      }.bind(this), 100);
    }.bind(this), false);

    jQuery(document).on('mediaready', function (e) {
      this.scene.add(e.mesh);
    }.bind(this));
  },

  /**
   * Resizes the camera when document is resized.
   */
  onWindowResize: function () {
    var paddingTop = jQuery("#global-navigation").height() + jQuery("#context-navigation").height() + jQuery("#footer").height();

    var paddingLeft = 20;
    paddingTop += 30;

    this.WIDTH = window.innerWidth - paddingLeft;
    this.HEIGHT = window.innerHeight - paddingTop;

    this.cameras.liveCam.aspect = this.WIDTH / this.HEIGHT;
    this.cameras.liveCam.updateProjectionMatrix();
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setViewport(0, 0, this.WIDTH, this.HEIGHT);

    var toolbarContainer = document.getElementById("toolbar");
    if (toolbarContainer) {
      document.getElementById("toolbar").style.maxHeight = this.HEIGHT + "px";
    }
  }
};