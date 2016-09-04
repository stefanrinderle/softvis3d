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

import {SoftVis3dScene} from '../../react/visualization/SoftVis3dScene';
import {SoftVis3dMesh} from '../../react/visualization/domain/SoftVis3dMesh';

var THREE = require("three");
var OrbitControls = require('three-orbit-controls')(THREE);

/**
 * Service which initiates the THREE.js scene and
 *  provides methods to interact with that scene
 *
 * @param {angular.$timeout} $timeout
 * @param {ThreeViewer.MessageBus} MessageBus
 *
 * @constructor
 * @export
 * @ngInject
 */
ThreeViewer.ViewerService = function ($timeout, MessageBus) {
  this.timeout = $timeout;
  this.MessageBus = MessageBus;
  this.softvis3dScene = null;
};

/**
 * Initialize the 3D scene
 * @param {!object} params
 */
ThreeViewer.ViewerService.prototype.init = function (canvasId) {
  var loadDelay = 1500;
  this.softvis3dScene = new SoftVis3dScene(canvasId);

  /**
   * TODO: Move to typescript. Tried, but had an import issue.
   */
  var controls = new OrbitControls(this.softvis3dScene.getCamera(), this.softvis3dScene.getContainer());
  controls.zoomSpeed = 1.5;

  this.timeout(function () {
    this.MessageBus.trigger('appReady');
  }.bind(this), loadDelay);

  this.animate();
  this.listeners();
};

ThreeViewer.ViewerService.prototype.listeners = function () {
  var me = this;
  window.addEventListener("resize", function () {
    me.softvis3dScene.onWindowResize();
  }, true);
};

/**
 * @export
 */
ThreeViewer.ViewerService.prototype.animate = function () {
  requestAnimationFrame(this.animate.bind(this));
  this.render();
};

/**
 * @export
 */
ThreeViewer.ViewerService.prototype.render = function () {
  this.softvis3dScene.render();
};

ThreeViewer.ViewerService.prototype.loadSoftVis3d = function (data) {
  this.softvis3dScene.loadSoftVis3d(data);
};

ThreeViewer.ViewerService.prototype.selectSceneTreeObject = function (objectSoftVis3dId) {
  this.softvis3dScene.selectSceneTreeObject(objectSoftVis3dId);
};

ThreeViewer.ViewerService.prototype.showAllSceneElements = function () {
  this.softvis3dScene.showAllSceneElements();
};

ThreeViewer.ViewerService.prototype.hideAllSceneElementsExceptIds = function (showIds) {
  this.softvis3dScene.hideAllSceneElementsExceptIds(showIds);
};

ThreeViewer.ViewerService.prototype.removeObject = function (objectSoftVis3dId) {
  this.softvis3dScene.removeObject(objectSoftVis3dId);
};

/**
 * See if a mouse click intersects an object.
 * @param {!{x:number, y:number}} mouse
 */
ThreeViewer.ViewerService.prototype.makeSelection = function (event) {
  var intersectedSoftVis3dId = this.softvis3dScene.makeSelection(event);

  if (intersectedSoftVis3dId != null) {
    let eventObject = new SoftVis3dMesh(intersectedSoftVis3dId);
    this.MessageBus.trigger("objectSelected", eventObject);
  }

};
