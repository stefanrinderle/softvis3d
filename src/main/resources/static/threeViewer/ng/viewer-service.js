/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
'use strict';
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
ThreeViewer.ViewerService = function($timeout, MessageBus){
    this.timeout = $timeout;
    this.MessageBus = MessageBus;
    this.home = null;
};

/**
 * Initialize the 3D scene
 * @param {!object} params
 */
ThreeViewer.ViewerService.prototype.init = function (params){
    this.home = new Viewer.Scene(params);
    this.timeout(function(){
        this.MessageBus.trigger('appReady');
    }.bind(this), SETUP.LOAD_DELAY);

    this.animate();
};

/**
 * @export
 */
ThreeViewer.ViewerService.prototype.animate = function(){
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

/**
 * See if a mouse click intersects an object.
 * @param {!{x:number, y:number}} mouse
 */
ThreeViewer.ViewerService.prototype.makeSelection = function (e) {
    var offsetLeft = 170;
    var offsetTop = 68;

    var x = e.gesture.center.x - offsetLeft;
    var y = e.gesture.center.y - offsetTop;

    var width = this.home.WIDTH;
    var height = this.home.HEIGHT;

    // creating NDC coordinates for ray intersection.
    var mouseDown = {};
    mouseDown.x = (x / width) * 2 - 1;
    mouseDown.y = -(y / height) * 2 + 1;

    var vector = new THREE.Vector3( mouseDown.x, mouseDown.y, 1).unproject(this.home.cameras.liveCam);
    this.home.raycaster.set(this.home.cameras.liveCam.position, vector.sub(this.home.cameras.liveCam.position).normalize());
    var intersected = this.home.raycaster.intersectObjects(this.home.wrangler.objectsInView, true);

    if(intersected.length > 0){
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
