/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
'use strict';

goog.provide('ThreeViewer.FileLoaderController');

/**
 * Service which initiates the THREE.js scene and
 *  provides methods to interact with that scene
 *
 * @param {angular.$scope} $scope
 * @param {ThreeViewer.MessageBus} MessageBus
 * @param {ThreeViewer.ViewerService} ViewerService
 * @param {ThreeViewer.BackendService} BackendService
 *
 * @constructor
 * @export
 * @ngInject
 */
ThreeViewer.FileLoaderController = function ($scope, MessageBus, ViewerService, BackendService, TreeService) {

    this.scope = $scope;
    this.MessageBus = MessageBus;
    this.ViewerService = ViewerService;
    this.BackendService = BackendService;
    this.TreeService = TreeService;

    /**
     * @type {{recent: boolean, loadJS: boolean, loadGLTF: boolean, loadOBJ: boolean}}
     */
    this.state = {
        'recent': true,
        'loadJS': false,
        'loadGLTF': false,
        'loadOBJ': false
    };

    this.data = {
        'viewType': null
    };

    this.init();
};

/**
 * Executes anything after construction.
 */
ThreeViewer.FileLoaderController.prototype.init = function () {
    this.listeners();
};

ThreeViewer.FileLoaderController.prototype.listeners = function () {
    this.scope.$on('appReady', function () {
        console.log("app ready");
    }.bind(this));
};

/**
 * Toggles the selected tab
 * @export
 * @param {!string} tab
 */
ThreeViewer.FileLoaderController.prototype.showTab = function (tab) {
    this.state.recent = false;
    this.state.loadJS = false;
    this.state.loadGLTF = false;
    this.state.loadOBJ = false;
    this.state[tab] = true;
};

/**
 * @export
 *
 */
ThreeViewer.FileLoaderController.prototype.visualisationExample = function () {
    var me = this;
    console.log("hier id: " + ThreeViewer.SNAPSHOT_ID);
    this.BackendService.getVisualization(96467, 1, 20, this.data.viewType).then(function (data) {
        me.ViewerService.loadSoftVis3d(data);

        me.BackendService.getTreeForSnapshotView(96467, 1, 20, me.data.viewType).then(function (data) {
            me.TreeService.setTree(data);
            me.MessageBus.trigger('hideLoader');
        });
    });
};