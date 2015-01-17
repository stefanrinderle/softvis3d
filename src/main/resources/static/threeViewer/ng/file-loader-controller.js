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
     * @type {{city: boolean, dependency: boolean, custom: boolean, loading: boolean}}
     */
    this.state = {
        'city': true,
        'dependency': false,
        'custom': false,
        'loading': false
    };

    this.cityInnerState = "complexity";
    this.loadingInnerState = "idle";
    this.customViewType = "city";

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
    this.state.loading = false;
    this.state[tab] = true;
};

ThreeViewer.FileLoaderController.prototype.submitCityForm = function () {
    console.log("submitCityForm");
    var cityType = "city";

    if (this.cityInnerState === "complexity") {
        this.loadVisualisation(20, 1, cityType);
    } else if (this.cityInnerState === "issues") {
        this.loadVisualisation(95, 1, cityType);
    } else if (this.cityInnerState === "functions") {
        this.loadVisualisation(9, 1, cityType);
    } else {
        console.log("invalid option selected.")
    }
};

/**
 * @export
 *
 */
ThreeViewer.FileLoaderController.prototype.loadDependencyView = function () {
    this.loadVisualisation(20, 1, "dependency");
};

ThreeViewer.FileLoaderController.prototype.loadCustomView = function () {
    this.loadVisualisation(this.settings.metric1, this.settings.metric2, this.customViewType);
};

ThreeViewer.FileLoaderController.prototype.loadVisualisation = function (metric1, metric2, viewType) {
    var me = this;

    this.loadingInnerState = "loading";
    this.showTab("loading");
    this.BackendService.getVisualization(
        ThreeViewer.SNAPSHOT_ID, metric1, metric2, viewType).then(function (data) {
            me.ViewerService.loadSoftVis3d(data);

            me.BackendService.getTreeForSnapshotView(
                ThreeViewer.SNAPSHOT_ID, metric1, metric2, viewType).then(function (data) {
                    me.TreeService.setTree(data);

                    var eventObject = {};
                    eventObject.softVis3dId = ThreeViewer.SNAPSHOT_ID;
                    eventObject.metric1Name = me.getNameForMetricId(metric1);
                    eventObject.metric2Name = me.getNameForMetricId(metric2);

                    me.MessageBus.trigger('visualizationReady', eventObject);

                    me.loadingInnerState = "idle";
                    me.showTab("city");

                    me.MessageBus.trigger('hideLoader');
                });
        });
};

ThreeViewer.FileLoaderController.prototype.getNameForMetricId = function (metricId) {
    for (var index = 0; index < this.availableMetrics.length; index++) {
        if (this.availableMetrics[index].id === metricId) {
            return this.availableMetrics[index].name;
        }
    }

    return "no name found";
};