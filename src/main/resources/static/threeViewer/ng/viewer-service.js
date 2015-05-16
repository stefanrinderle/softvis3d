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
goog.provide('ThreeViewer.ViewerService');

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
  this.home = null;
};

/**
 * Initialize the 3D scene
 * @param {!object} params
 */
ThreeViewer.ViewerService.prototype.init = function (params) {
  this.home = new Viewer.Scene(params);
  this.timeout(function () {
    this.MessageBus.trigger('appReady');
  }.bind(this), SETUP.LOAD_DELAY);

  this.animate();
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
  this.home.renderer.render(this.home.scene, this.home.cameras.liveCam);
};

ThreeViewer.ViewerService.prototype.loadSoftVis3d = function (data) {
  this.home.wrangler.loadSoftVis3d(data);
};

ThreeViewer.ViewerService.prototype.selectSceneTreeObject = function (objectSoftVis3dId) {
  this.home.wrangler.selectSceneTreeObject(objectSoftVis3dId);
};

ThreeViewer.ViewerService.prototype.showAllSceneElements = function () {
  this.home.wrangler.showAllSceneElements();
};

ThreeViewer.ViewerService.prototype.hideAllSceneElementsExceptIds = function (showIds) {
  this.home.wrangler.hideAllSceneElementsExceptIds(showIds);
};

ThreeViewer.ViewerService.prototype.removeObject = function (objectSoftVis3dId, type) {
  this.home.wrangler.removeObject(objectSoftVis3dId, type);
};

/**
 * from details
 */
ThreeViewer.ViewerService.prototype.selectSceneEdgeObjects = function (objectSoftVis3dId) {
  this.home.wrangler.selectSceneEdgeObjects(objectSoftVis3dId);
};


/**
 * See if a mouse click intersects an object.
 * @param {!{x:number, y:number}} mouse
 */
ThreeViewer.ViewerService.prototype.makeSelection = function (event) {
  var canvas = jQuery("#content");

  var x, y;
  if (event.offsetX != undefined && event.offsetY != undefined) {
    x = event.offsetX;
    y = event.offsetY;
  } else // Firefox method to get the position
  {
    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    x -= canvas.offset().left;
    y -= canvas.offset().top;

    x -= canvas.css("padding-left").replace("px", "");
    y -= canvas.css("padding-top").replace("px", "");
  }

  var width = this.home.WIDTH;
  var height = this.home.HEIGHT;

  // creating NDC coordinates for ray intersection.
  var mouseDown = {};
  mouseDown.x = (x / width) * 2 - 1;
  mouseDown.y = -(y / height) * 2 + 1;

  var vector = new THREE.Vector3(mouseDown.x, mouseDown.y, 1).unproject(this.home.cameras.liveCam);
  this.home.raycaster.set(this.home.cameras.liveCam.position, vector.sub(this.home.cameras.liveCam.position).normalize());
  var intersected = this.home.raycaster.intersectObjects(this.home.wrangler.objectsInView, true);

  if (intersected.length > 0) {
    var objectSoftVis3dId = intersected[0].object.softVis3dId;
    var objectSoftVis3dType = intersected[0].object.softVis3dType;

    var eventObject = {};
    eventObject.softVis3dId = objectSoftVis3dId;
    eventObject.softVis3dType = objectSoftVis3dType;

    this.selectSceneTreeObject(objectSoftVis3dId);
    this.MessageBus.trigger('objectSelected', eventObject);
  } else {
    intersected = null;
    console.info('No intersection detected');
  }
  return intersected;
};
