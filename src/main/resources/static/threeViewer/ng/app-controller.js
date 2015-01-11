/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
'use strict';
goog.provide('ThreeViewer.AppController');

/**
 *
 * @param {angular.Scope} $scope
 * @param {ThreeViewer.ViewerService} ViewerService
 *
 * @constructor
 * @export
 * @ngInject
 */
ThreeViewer.AppController = function ($scope, ViewerService) {

    this.scope = $scope;
    this.ViewerService = ViewerService;

    /**
     * @expose
     * @type {{about: boolean, visible: boolean, loader: boolean}}
     */
    this.tb = {
        'about': false,
        'visible': true,
        'loader': true
    };

    this.init();
};

ThreeViewer.AppController.prototype.init = function () {
    this.ViewerService.init({
        canvasId: 'viewer',
        containerId: 'container'
    });
    this.listeners();
};

ThreeViewer.AppController.prototype.listeners = function () {

    this.scope.$on('hideLoader', function () {
        this.tb.loader = false;
    }.bind(this));

};

/**
 * @export
 */
ThreeViewer.AppController.prototype.toggleLoader = function () {
    this.tb.about = false;
    this.tb.loader = !this.tb.loader;
};

/**
 * @export
 */
ThreeViewer.AppController.prototype.hideAbout = function () {
    this.tb.about = false;
};

/**
 * @export
 */
ThreeViewer.AppController.prototype.toggleToolbar = function () {
    this.tb.about = false;
    this.tb.visible = !this.tb.visible;
};

/**
 * @export
 */
ThreeViewer.AppController.prototype.showAbout = function () {
    this.tb.loader = false;
    this.tb.visible = false;
    this.tb.about = true;
};

/**
 * @export
 */
ThreeViewer.AppController.prototype.hideLoader = function () {
    this.tb.loader = false;
};

/**
 * @export
 */
ThreeViewer.AppController.prototype.hideToolbar = function () {
    this.tb.visible = false;
};