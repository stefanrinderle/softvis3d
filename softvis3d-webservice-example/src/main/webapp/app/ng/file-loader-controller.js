/*
 * softvis3d-webservice-example
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
    'examples': true, 'neo': false, 'info': false
  };

    this.dynamicNeoQuery = "MATCH "
        + "(t:Type)-[:DECLARES]->(m:Method) "
        + "  RETURN "
        + "t.fqn AS Type, count(t) AS DeclaredMethods";
    this.infoInnerState = "idle";

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
  var me = this;

  if (!Detector.webgl) {
    this.waitFor(500, 0, function () {
      me.infoInnerState = "error";
      me.exceptionMessage = Detector.getWebGLErrorMessage();
      me.showTab("info");
    });
  } else {
    this.listeners();
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
  this.state.examples = false;
  this.state.neo = false;
  this.state.info = false;
  this.state[tab] = true;
};

ThreeViewer.FileLoaderController.prototype.loadExampleVisualization = function () {
    var me = this;

    this.infoInnerState = "loading";
    this.showTab("info");
    this.BackendService.getExamleVisualization().then(function (response) {
        me.processSuccessResponse(response);
    }, function (response) {
        me.processErrorResponse(response);
    });
};

ThreeViewer.FileLoaderController.prototype.loadStaticVisualization = function () {
    var me = this;

    this.infoInnerState = "loading";
    this.showTab("info");
    this.BackendService.getStaticVisualization().then(function (response) {
        me.processSuccessResponse(response);
    }, function (response) {
        me.processErrorResponse(response);
    });
};

ThreeViewer.FileLoaderController.prototype.loadDynamicVisualization = function () {
    var me = this;

    this.infoInnerState = "loading";
    this.showTab("info");
    this.BackendService.getDynamicVisualization(this.dynamicNeoQuery).then(function (response) {
        me.processSuccessResponse(response);
    }, function (response) {
        me.processErrorResponse(response);
    });
};

ThreeViewer.FileLoaderController.prototype.processErrorResponse = function (response) {
    this.infoInnerState = "error";
    this.exceptionMessage = response.data.errors[0].msg;
    this.showTab("info");
};

ThreeViewer.FileLoaderController.prototype.processSuccessResponse = function (response) {
    var me = this;
    var treeResult = response.data.resultObject[0].treeResult;
    var visualizationResult = response.data.resultObject[1].visualizationResult;

    me.ViewerService.loadSoftVis3d(visualizationResult);
    me.TreeService.setTree(treeResult);

    var eventObject = {};
    eventObject.softVis3dId = 1;
    eventObject.metric1Name = "bla";
    eventObject.metric2Name = "bla2";
    eventObject.scmMetricName = "bla3";

    me.MessageBus.trigger('visualizationReady', eventObject);

    me.infoInnerState = "idle";
    me.showTab("example");

    me.MessageBus.trigger('hideLoader');
};
