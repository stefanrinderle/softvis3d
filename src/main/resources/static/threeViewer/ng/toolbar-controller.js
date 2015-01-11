/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
'use strict';
goog.provide('ThreeViewer.ToolbarController');

/**
 *
 * @param {angular.Scope} $scope
 * @param {ThreeViewer.ViewerService} ViewerService
 *
 * @constructor
 * @export
 * @ngInject
 */
ThreeViewer.ToolbarController = function ($scope, ViewerService) {

    this.scope = $scope;
    this.ViewerService = ViewerService;

    /**
     * @expose
     * @type {{scale: number, rotateX: number, rotateY: number, rotateZ: number, positionX: number, positionY: number, positionZ: number}}
     */
    this.data = {
        'scale': 1,
        'rotateX': 0,
        'rotateY': 0,
        'rotateZ': 0,
        'positionX': 0,
        'positionY': 0,
        'positionZ': 0
    };

    this.init();
};

ThreeViewer.ToolbarController.prototype.init = function () {
};

/**
 * @export
 */
ThreeViewer.ToolbarController.prototype.scale = function () {
    this.ViewerService.scale(this.data.scale);
};

/**
 * Rotate around an axis
 */
ThreeViewer.ToolbarController.prototype.rotate = function () {
    this.ViewerService.rotate(
        parseFloat(this.data.rotateX),
        parseFloat(this.data.rotateY),
        parseFloat(this.data.rotateZ));
};

/**
 * Translate around the scene
 */
ThreeViewer.ToolbarController.prototype.translate = function () {
    this.ViewerService.translate(
        parseFloat(this.data.positionX),
        parseFloat(this.data.positionY),
        parseFloat(this.data.positionZ));
};
