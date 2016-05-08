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

var dagre = require("dagre");

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
    // var visualizationResult = response.data.resultObject[1].visualizationResult;

    // me.ViewerService.loadSoftVis3d(visualizationResult);
    // me.TreeService.setTree(treeResult);
    me.createSampleViewLayout(treeResult);

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

ThreeViewer.FileLoaderController.prototype.createSampleViewLayout = function (treeResult) {
    this.TreeService.setTree(treeResult);

    var g = new dagre.graphlib.Graph({ compound: true });

// Set an object for the graph label
    g.setGraph({});

// Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function() { return {}; });

    g.setNode("root", { label: "root",  width: 1, height: 1 });

    this.createGraphNodes(treeResult, g, undefined, 0);

    var me = this;
    g.nodes().forEach(function(v) {

        var children = g.children(v);
        if (children.length > 0) {
            me.addEdgesForLayout(g, children);
        }

    });

    dagre.layout(g);

    var visualizationResult = [
        {
            "platformId": "1",
            "opacity": 1.0,
            "color": "#323232",
            "height3d": 0,
            "positionX": 0.0,
            "positionY": 0.0,
            "width": g.graph().width,
            "platformHeight": 10,
            "height": g.graph().height,
            "nodes": []
        }
    ];


    g.nodes().forEach(function(v) {
        var sourceNode = g.node(v);

        sourceNode.x = sourceNode.x - (g.graph().width / 2);
        sourceNode.y = sourceNode.y - (g.graph().height / 2);

        var buildingHeight = sourceNode.buildingHeight;

        var color = "#0000FF";
        if (g.children(v).length > 0) {
            buildingHeight = 10.0;
            color = "#FFE300";
        }

        if (v === "root") {
            buildingHeight = 1.0;
        }

        var node = {
            "id": v,
            "buildingHeight": buildingHeight,
            "height": sourceNode.height,
            "width": sourceNode.width,
            "positionX": sourceNode.x,
            "positionY": sourceNode.y,
            "type": "TREE",
            "opacity": 0.0,
            "color": color,
            "height3d": sourceNode.depth * 10
        };

        visualizationResult[0].nodes.push(node);
    });

    this.ViewerService.loadSoftVis3d(visualizationResult);

    var eventObject = {};
    eventObject.softVis3dId = 1;
    eventObject.metric1Name = "bla";
    eventObject.metric2Name = "bla2";
    eventObject.scmMetricName = "bla3";

    this.MessageBus.trigger('visualizationReady', eventObject);

    this.infoInnerState = "idle";
    this.showTab("example");

    this.MessageBus.trigger('hideLoader');
    // me.processSuccessResponse(response);
};

ThreeViewer.FileLoaderController.prototype.createGraphNodes = function (node, g, parent, depth) {
    g.setNode(node.id, {
        label: node.name,
        width: node.footprintMetricValue,
        height: node.footprintMetricValue,
        buildingHeight: node.heightMetricValue,
        color: node.colorMetricValue,
        depth: depth
    });

    if (parent !== undefined) {
        g.setParent(node.id, parent);
    }

    for (var i = 0; i < node.children.length; i++) {
        this.createGraphNodes(node.children[i], g, node.id, depth++);
    }
};

ThreeViewer.FileLoaderController.prototype.addEdgesForLayout = function (g, children) {
    var nodesNamesArray = children;
    var lineAndRowNumber = Math.ceil(Math.sqrt(nodesNamesArray.length));
    var allNodesLength = nodesNamesArray.length;

    for (var index = 0; index < allNodesLength; index++) {

        var nextNodeDestinationIndex = index + lineAndRowNumber;
        var isEdgeNeededAndPossible = nextNodeDestinationIndex < allNodesLength;
        if (isEdgeNeededAndPossible) {

            var sourceNodeName = nodesNamesArray[index];
            var destinationNodeName = nodesNamesArray[nextNodeDestinationIndex];

            if (g.children(sourceNodeName).length === 0 && g.children(destinationNodeName).length === 0) {
                g.setEdge(sourceNodeName, destinationNodeName);
            }

        }

    }
};

ThreeViewer.FileLoaderController.prototype.getNameForMetricKey = function (metricKey) {
  for (var index = 0; index < this.availableMetrics.length; index++) {
    if (this.availableMetrics[index].key === metricKey) {
      return this.availableMetrics[index].name;
    }
  }

  return "No name found";
};