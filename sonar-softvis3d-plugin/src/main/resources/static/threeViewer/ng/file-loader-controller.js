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
var Detector = require('../lib/Detector.js');
var Softvis3dModel = require("softvis3d-model");

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

  this.state = {
    'city': true, 'custom': false, 'info': false
  };

  this.cityInnerState = "complexity";
  this.infoInnerState = "idle";

  this.exceptionMessage = null;

  this.customSelectMetrics = {
    'metric1': 'complexity',
    'metric2': 'ncloc',
    'metric3': 'NONE'
  };

  this.availableMetrics = [];
  this.availableColorMetrics = [];

  this.configLoaded = false;

  this.BASE_PATH = RESOURCES_BASE_PATH;

  this.init();
};

/**
 * Executes anything after construction.
 */
ThreeViewer.FileLoaderController.prototype.init = function () {
  var me = this;

  if (!Detector.webgl) {
    this.waitFor(500, 0, function () {
      me.infoInnerState = "error";
      me.exceptionMessage = Detector.getWebGLErrorMessage();
      me.showTab("info");
    });
  } else {
    this.listeners();

    this.waitFor(500, 0, function () {
        me.BackendService.getMetrics().then(function (response) {
            me.availableMetrics = me.filterMetrics(response.data.metrics);

            me.availableColorMetrics = [];
            me.availableColorMetrics.push({
                key: "NONE",
                name: "Not used"
            });
            for (var index = 0; index < me.availableMetrics.length; index++) {
                me.availableColorMetrics.push(me.availableMetrics[index]);
            }

            me.hasScmInfos = false;
            me.availableScmMetrics = [];
            me.configLoaded = true;
            me.customSelectMetrics = {
                'metric1': 'complexity',
                'metric2': 'ncloc',
                'metric3': 'NONE'
            };

        }, function (response) {
            me.infoInnerState = "error";
            me.exceptionMessage = response.data.errors[0].msg;
            me.showTab("info");
        });
    });
  }
};

ThreeViewer.FileLoaderController.prototype.filterMetrics = function (metrics) {
    var result = [];

    for (var index = 0; index < metrics.length; index++) {
        // check if numeric!
        if (metrics[index].type === 'INT' || metrics[index].type === 'PERCENT'
            || metrics[index].type === 'FLOAT' || metrics[index].type === 'RATING' ) {
            result.push(metrics[index]);
        }
    }

    return result;
};

ThreeViewer.FileLoaderController.prototype.waitFor = function(msec, count, callback) {
  var me = this;
  // Check if condition met. If not, re-check later (msec).
  if (ThreeViewer.PROJECT_KEY === undefined) {
    count++;
    setTimeout(function () {
      me.waitFor(msec, count, callback);
    }, msec);

      return;

  } else {
    // Condition finally met. callback() can be executed.
    callback();
  }
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
  this.state.custom = false;
  this.state.info = false;
  this.state[tab] = true;
};

ThreeViewer.FileLoaderController.prototype.submitCityForm = function () {
  var linesKey = "ncloc";
  var complexityKey = "complexity";
  var issuesKey = "violations";
  var functionsKey = "functions";
  var noMetric = "NONE";

  if (this.cityInnerState === "complexity") {
    this.loadVisualisation(complexityKey, linesKey, noMetric);
  } else if (this.cityInnerState === "issues") {
    this.loadVisualisation(issuesKey, linesKey, noMetric);
  } else if (this.cityInnerState === "functions") {
    this.loadVisualisation(functionsKey, linesKey, noMetric);
  } else {
    console.log("invalid option selected.");
  }
};

ThreeViewer.FileLoaderController.prototype.loadCustomView = function () {
  this.loadVisualisation(this.customSelectMetrics.metric1, this.customSelectMetrics.metric2, this.customSelectMetrics.metric3);
};

ThreeViewer.FileLoaderController.prototype.loadVisualisation = function (metric1, metric2, colorMetricKey) {
  var me = this;

  this.infoInnerState = "loading";
  this.showTab("info");
  this.BackendService.getVisualization(ThreeViewer.PROJECT_KEY, metric1, metric2, colorMetricKey).then(function (response) {

    var treeResult = response.data.resultObject[0].treeResult;

    var illustration = me.createModel(treeResult);
    me.ViewerService.loadSoftVis3d(illustration);

    var eventObject = {};
    eventObject.softVis3dId = ThreeViewer.PROJECT_KEY;
    eventObject.metric1Name = me.getNameForMetricKey(metric1);
    eventObject.metric2Name = me.getNameForMetricKey(metric2);
    eventObject.colorMetricKey = me.getNameForMetricKey(colorMetricKey);

    me.MessageBus.trigger('visualizationReady', eventObject);

    me.infoInnerState = "idle";
    me.showTab("city");

    me.MessageBus.trigger('hideLoader');
  }, function (response) {
    me.infoInnerState = "error";
    me.exceptionMessage = response.data.errors[0].msg;
    me.showTab("info");
  });
};

ThreeViewer.FileLoaderController.prototype.createModel = function (treeResult) {
  this.TreeService.setTree(treeResult);

  var model = new Softvis3dModel(treeResult);
  
  return model.getIllustration();
};

ThreeViewer.FileLoaderController.prototype.getNameForMetricKey = function (metricKey) {
  for (var index = 0; index < this.availableMetrics.length; index++) {
    if (this.availableMetrics[index].key === metricKey) {
      return this.availableMetrics[index].name;
    }
  }

  return "No name found";
};