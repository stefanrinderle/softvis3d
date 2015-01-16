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
     * @type {{city: boolean, dependency: boolean, custom: boolean}}
     */
    this.state = {
        'city': true,
        'dependency': false,
        'custom': false
    };

    this.data = {
        'viewType': "city"
    };

    this.settings = {
        'metric1': null,
        'metric2': null
    };

    this.availableMetrics = [];

    this.init();
};

/**
 * Executes anything after construction.
 */
ThreeViewer.FileLoaderController.prototype.init = function () {
    this.listeners();

    var me = this;
    this.BackendService.getConfig(ThreeViewer.SNAPSHOT_ID).then(function (data) {
            me.settings = data.settings;
            me.availableMetrics = data.metricsForSnapshot;
            me.hasDependencies = data.hasDependencies;
        });
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
    this.state.city = false;
    this.state.dependency = false;
    this.state.custom = false;
    this.state[tab] = true;
};

/**
 * @export
 *
 */
ThreeViewer.FileLoaderController.prototype.visualisationExample = function () {
    var me = this;
    this.BackendService.getVisualization(
        ThreeViewer.SNAPSHOT_ID, 1, 20, this.data.viewType).then(function (data) {
            me.ViewerService.loadSoftVis3d(data);

            me.BackendService.getTreeForSnapshotView(
                ThreeViewer.SNAPSHOT_ID, 1, 20, me.data.viewType).then(function (data) {
                me.TreeService.setTree(data);
                me.MessageBus.trigger('hideLoader');

                var eventObject = {};
                eventObject.softVis3dId = ThreeViewer.SNAPSHOT_ID;
                eventObject.softVis3dType = "node";

                me.MessageBus.trigger('objectSelected', eventObject);
            });
    });
};