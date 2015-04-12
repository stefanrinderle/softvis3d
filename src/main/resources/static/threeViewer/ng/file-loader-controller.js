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
     * @type {{city: boolean, dependency: boolean, custom: boolean, info: boolean}}
     */
    this.state = {
        'city': true, 'dependency': false, 'custom': false, 'info': false
    };

    this.cityInnerState = "complexity";
    this.infoInnerState = "idle";
    this.customViewType = "city";

    this.exceptionMessage;

    this.settings = {
        'metric1': null, 'metric2': null
    };

    this.availableMetrics = [];

    this.configLoaded = false;

    this.BASE_PATH = RESOURCES_BASE_PATH;

    this.init();
};

/**
 * Executes anything after construction.
 */
ThreeViewer.FileLoaderController.prototype.init = function () {
    this.listeners();

    var me = this;
    this.BackendService.getConfig(ThreeViewer.SNAPSHOT_ID).then(function (response) {
        me.settings = response.data.settings;
        me.availableMetrics = response.data.metricsForSnapshot;
        me.hasDependencies = response.data.hasDependencies;
        me.configLoaded = true;
    }, function (response) {
        console.log(response);
        me.infoInnerState = "error";
        me.exceptionMessage = response.data.errors[0].msg;
        me.showTab("info");
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
    this.state.info = false;
    this.state[tab] = true;
};

ThreeViewer.FileLoaderController.prototype.submitCityForm = function () {
    var cityType = "city";

    var linesId = this.getMetricIdForName("Lines");
    var complexityId = this.getMetricIdForName("Cyclomatic complexity");
    var issuesId = this.getMetricIdForName("Issues");
    var functionsId = this.getMetricIdForName("Functions");

    if (this.cityInnerState === "complexity") {
        this.loadVisualisation(complexityId, linesId, cityType);
    } else if (this.cityInnerState === "issues") {
        this.loadVisualisation(issuesId, linesId, cityType);
    } else if (this.cityInnerState === "functions") {
        this.loadVisualisation(functionsId, linesId, cityType);
    } else {
        console.log("invalid option selected.")
    }
};

/**
 * @export
 *
 */
ThreeViewer.FileLoaderController.prototype.loadDependencyView = function () {
    var linesId = this.getMetricIdForName("Lines");
    var complexityId = this.getMetricIdForName("Cyclomatic complexity");

    this.loadVisualisation(complexityId, linesId, "dependency");
};

ThreeViewer.FileLoaderController.prototype.loadCustomView = function () {
    this.loadVisualisation(this.settings.metric1, this.settings.metric2, this.customViewType);
};

ThreeViewer.FileLoaderController.prototype.loadDirectLink = function (metric1Id, metric2Id, viewType) {
    this.loadVisualisation(metric1Id, metric2Id, viewType);
};

ThreeViewer.FileLoaderController.prototype.loadVisualisation = function (metric1, metric2, viewType) {
    var me = this;

    this.infoInnerState = "loading";
    this.showTab("info");
    this.BackendService.getVisualization(ThreeViewer.SNAPSHOT_ID, metric1, metric2, viewType).then(function (response) {
                var treeResult = response.data.resultObject[0].treeResult;
                var visualizationResult = response.data.resultObject[1].visualizationResult;

                me.ViewerService.loadSoftVis3d(visualizationResult);
                me.TreeService.setTree(treeResult);

                var eventObject = {};
                eventObject.softVis3dId = ThreeViewer.SNAPSHOT_ID;
                eventObject.metric1Name = me.getNameForMetricId(metric1);
                eventObject.metric2Name = me.getNameForMetricId(metric2);

                me.MessageBus.trigger('visualizationReady', eventObject);

                me.infoInnerState = "idle";
                me.showTab("city");

                me.MessageBus.trigger('hideLoader');
            }, function (response) {
                console.log(response);
                me.infoInnerState = "error";
                me.exceptionMessage = response.data.errors[0].msg;
                me.showTab("info");
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

ThreeViewer.FileLoaderController.prototype.getMetricIdForName = function (nameToSearch) {
    for (var index = 0; index < this.availableMetrics.length; index++) {
        if (this.availableMetrics[index].name === nameToSearch) {
            return this.availableMetrics[index].id;
        }
    }

    return "no name found";
};