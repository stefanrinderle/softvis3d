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
     * @type {{about: boolean, toolbar: boolean, loader: boolean}}
     */
    this.tb = {
        'about': false,
        'toolbar': false,
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
    var me = this;
    this.scope.$on('hideLoader', function () {
        me.tb.loader = false;
        me.tb.toolbar = true;
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
ThreeViewer.AppController.prototype.toggleAbout = function () {
    this.tb.loader = false;
    this.tb.about = !this.tb.about;
};

/**
 * @export
 */
ThreeViewer.AppController.prototype.toggleToolbar = function () {
    this.tb.toolbar = !this.tb.toolbar;
};