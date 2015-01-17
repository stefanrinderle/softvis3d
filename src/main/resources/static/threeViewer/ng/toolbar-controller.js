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
 * @param {ThreeViewer.TreeService} TreeService
 * @constructor
 * @export
 * @ngInject
 */
ThreeViewer.ToolbarController = function ($scope, ViewerService, TreeService, MessageBus) {

    this.scope = $scope;
    this.ViewerService = ViewerService;
    this.TreeService = TreeService;
    this.MessageBus = MessageBus;

    this.node = null;
    this.displayChildren = false;

    this.inEdges = [];
    this.outEdges = [];
    this.displayEdges = false;

    this.edge = null;
    this.edgeIncludingEdges = null;
    this.displayEdgeIncludingEdges = false;

    this.metric1Name = "";
    this.metric2Name = "";

    this.BASE_PATH = ThreeViewer.RESOURCES_BASE_PATH;

    this.init();
};

ThreeViewer.ToolbarController.prototype.init = function () {
    this.listeners();
};

ThreeViewer.ToolbarController.prototype.listeners = function () {
    var me = this;
    this.scope.$on('objectSelected', function (event) {
        var eventObject = me.MessageBus.getMessage('objectSelected');

        me.showDetails(eventObject.softVis3dId, eventObject.softVis3dType);
        me.scope.$apply();
    }.bind(this));

    this.scope.$on('visualizationReady', function (event) {
        var eventObject = me.MessageBus.getMessage('visualizationReady');

        me.metric1Name = eventObject.metric1Name;
        me.metric2Name = eventObject.metric2Name;

        me.showDetails(eventObject.softVis3dId, "node");

        window.dispatchEvent(new Event('resize'));
    }.bind(this));

};

ThreeViewer.ToolbarController.prototype.showDetails = function (softVis3dId, type) {
    if (type == "dependency") {
        this.node = null;
        this.edge = this.TreeService.searchEdge(softVis3dId)
        this.privateShowEdgeEdgeDetails(this.edge);
        this.inEdges = [];
        this.outEdges = [];
    } else {
        this.node = this.TreeService.searchTreeNode(softVis3dId);
        this.privateShowNodeEdgeDetails(this.node);
        this.edge = null;
        this.edgeIncludingEdges = null;
        this.displayEdgeIncludingEdges = false;
    }
};

ThreeViewer.ToolbarController.prototype.privateShowNodeEdgeDetails = function (sourceNode) {
    this.outEdges = [];
    // outbound dependencies
    for (var index = 0; index < sourceNode.edges.length; index++) {
        var sourceEdge = sourceNode.edges[index];
        var targetEdge = {};
        targetEdge.id = sourceEdge.id;
        targetEdge.sourceName = sourceEdge.sourceName;
        targetEdge.destinationName = sourceEdge.destinationName;
        // copy including dependencies
        targetEdge.includingDependencies = sourceEdge.includingDependencies.slice();

        for (var j = 0; j < targetEdge.includingDependencies.length; j++) {
            targetEdge.includingDependencies[j].displayValue =
                this.TreeService.getDependencyNameForId(targetEdge.includingDependencies[j].id);
        }

        this.outEdges.push(targetEdge);
    }

    this.inEdges = [];
    // inbound dependencies
    var inboundEdges = this.TreeService.getInboundEdges(sourceNode);
    for (var index = 0; index < inboundEdges.length; index++) {
        var sourceEdge = inboundEdges[index];
        var targetEdge = {};
        targetEdge.id = sourceEdge.id;
        targetEdge.sourceName = sourceEdge.sourceName;
        targetEdge.destinationName = sourceEdge.destinationName;
        // copy including dependencies
        targetEdge.includingDependencies = sourceEdge.includingDependencies.slice();

        for (var j = 0; j < targetEdge.includingDependencies.length; j++) {
            targetEdge.includingDependencies[j].displayValue =
                this.TreeService.getDependencyNameForId(targetEdge.includingDependencies[j].id);
        }

        this.inEdges.push(targetEdge);
    }
};

ThreeViewer.ToolbarController.prototype.privateShowEdgeEdgeDetails = function (sourceEdge) {
    this.edgeIncludingEdges = [];

    for (var j = 0; j < sourceEdge.includingDependencies.length; j++) {
        var result = {};
        result.id = sourceEdge.includingDependencies[j].id;
        result.displayValue = this.TreeService.getDependencyNameForId(sourceEdge.includingDependencies[j].id);

        this.edgeIncludingEdges.push(result);
    }
};

ThreeViewer.ToolbarController.prototype.selectAllDependentDependencies = function (edge) {
    var clearedIncludingDependencyIds = [];
    for (var index = 0; index < edge.includingDependencies.length; index++) {
        clearedIncludingDependencyIds.push(edge.includingDependencies[index].id);
    }

    this.selectAllDependentDependenciesByIds(clearedIncludingDependencyIds);
};

ThreeViewer.ToolbarController.prototype.selectAllDependentDependenciesById = function (dependencyId) {
    var ids = [];
    ids.push(dependencyId);
    this.selectAllDependentDependenciesByIds(ids);
};

ThreeViewer.ToolbarController.prototype.selectAllDependentDependenciesByIds = function (includingDependencyIds) {
    var edgeIds = this.TreeService.getAllDependentEdgeIds(includingDependencyIds);
    this.ViewerService.selectSceneEdgeObjects(edgeIds);
};

ThreeViewer.ToolbarController.prototype.selectSceneObjectFromDetails = function (objectId, type) {
    if (type === "dependency") {
        var edgeIds = [];
        edgeIds.push(objectId);
        this.ViewerService.selectSceneEdgeObjects(edgeIds);
    } else {
        this.ViewerService.selectSceneTreeObject(objectId);
    }

    this.showDetails(objectId, type);
};

ThreeViewer.ToolbarController.prototype.showAllSceneElements = function () {
    this.ViewerService.showAllSceneElements();
};

ThreeViewer.ToolbarController.prototype.hideAllSceneElementsExceptIdTree = function (id) {
    var showIds = this.TreeService.getAllSceneElementsRecursive(id);
    this.ViewerService.hideAllSceneElementsExceptIds(showIds);
    this.ViewerService.removeObject(id, "leaf");
};

ThreeViewer.ToolbarController.prototype.triggerDisplayChildren = function () {
    if (this.displayChildren) {
        this.displayChildren = false;
    } else {
        this.displayChildren = true;
    }
};

ThreeViewer.ToolbarController.prototype.triggerDisplayEdges = function () {
    if (this.displayEdges) {
        this.displayEdges = false;
    } else {
        this.displayEdges = true;
    }
};

ThreeViewer.ToolbarController.prototype.triggerDisplayEdgeDetails = function (edge) {
    if (edge.displayDetails) {
        edge.displayDetails = false;
    } else {
        edge.displayDetails = true;
    }
};

ThreeViewer.ToolbarController.prototype.triggerDisplayEdgeIncludingEdges = function () {
    if (this.displayEdgeIncludingEdges) {
        this.displayEdgeIncludingEdges = false;
    } else {
        this.displayEdgeIncludingEdges = true;
    }
};