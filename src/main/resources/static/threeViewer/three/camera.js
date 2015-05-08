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
goog.provide('Viewer.Cameras');

/**
 * @namespace  Camera initialization.  Contains setup for both Perspective and Orthographic cameras.
 * @class Creates cameras for the scene.
 */
Viewer.Cameras = function (params) {

  this.context = params.context;

  this.liveCam = null;
  this.FOV = SETUP.CAM.FOV || 70;

  this.WIDTH = this.context.container.clientWidth;
  this.HEIGHT = this.context.container.clientHeight;

  // VIEWSIZE is the virtual distance across internally to the orthographic display.
  //   How many "3D world units" across the ration will represent.
  //   Setting this variable ensures you will have a regular distance across even if your windows resizes.
  this.VIEWSIZE = SETUP.CAM.VIEWSIZE || 1000;
  this.ASPECT_RATIO = this.WIDTH / this.HEIGHT;

  this.ORTHO_CAMERA = (SETUP.CAM.ORTHO) ? true : false;

  /** Perspective camera setup **/
  this.perpCam = null;
  this.PERP_NEAR_PLANE = SETUP.CAM.PERP_NEAR_PLANE || 1;
  this.PERP_FAR_PLANE = SETUP.CAM.PERP_FAR_PLANE || 10000;

  this.orthCam = null;
  this.ORTH_NEAR_PLANE = SETUP.CAM.ORTH_NEAR_PLANE || -1000;
  this.ORTH_FAR_PLANE = SETUP.CAM.ORTH_FAR_PLANE || 1000;

  this.controls = null;

  this.init();
};

Viewer.Cameras.prototype = {

  /**
   * Initialize a camera.
   */
  init: function () {
    if (this.ORTHO_CAMERA) {
      this.initOrthographicCamera();
    } else {
      this.initPerspective();
    }
  },

  /**
   *  Inititalize the orthographic camera.
   */
  initOrthographicCamera: function () {
    this.orthoCam = new THREE.OrthographicCamera
    (
        -this.ASPECT_RATIO * this.VIEWSIZE / 2,
        this.ASPECT_RATIO * this.VIEWSIZE / 2,
        this.VIEWSIZE / 2,
        this.VIEWSIZE / -2,
        this.ORTH_NEAR_PLANE,
        this.ORTH_FAR_PLANE
    );

    this.orthoCam.name = 'ortho';

    this.liveCam = this.orthoCam;
  },

  /**
   * Initialize the perspective camera.
   */
  initPerspective: function () {

    this.perpCam = new THREE.PerspectiveCamera
    (
        this.FOV,
        this.ASPECT_RATIO,
        this.PERP_NEAR_PLANE,
        this.PERP_FAR_PLANE
    );

    this.perpCam.position.y = 800;
    this.perpCam.position.z = 800;
    this.perpCam.lookAt(this.context.scene.position);

    this.perpCam.name = 'perp';

    this.liveCam = this.perpCam;
  },

  setCameraPosition: function (positionX, positionY, positionZ) {
    this.perpCam.position.x = positionX;
    this.perpCam.position.y = positionY;
    this.perpCam.position.z = positionZ;
    this.perpCam.lookAt(this.context.scene.position);
  }
};
