/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */

'use strict';
goog.provide('ThreeViewer.TreeService');

/**
 * Service which initiates the THREE.js scene and
 *  provides methods to interact with that scene
 *
 * @param {angular.$timeout} $timeout
 * @param {ThreeViewer.MessageBus} MessageBus
 *
 * @constructor
 * @export
 * @ngInject
 */
ThreeViewer.TreeService = function () {
    this.treeServiceTree = null;
};

ThreeViewer.TreeService.prototype.setTree = function (tree) {
    this.treeServiceTree = tree;
};

ThreeViewer.TreeService.prototype.searchTreeNode = function (id) {
    if (this.treeServiceTree != null) {
        return this.searchIdInElement(this.treeServiceTree, id);
    } else {
        console.warn("search for id " + id + " without initialized the tree.")
    }
};

ThreeViewer.TreeService.prototype.searchIdInElement = function (element, id) {
    if (element.id == id) {
        return element;
    } else if (element.children != null) {
        var result = null;
        for (var i = 0; result == null && i < element.children.length; i++) {
            result = this.searchIdInElement(element.children[i], id);
        }
        return result;
    }
    return null;
};

ThreeViewer.TreeService.prototype.searchEdge = function (id) {
    return this.searchEdgeInElement(this.treeServiceTree, id);
};

ThreeViewer.TreeService.prototype.searchEdgeInElement = function (element, id) {
    var result = null;

    for (var i = 0; result == null && i < element.edges.length; i++) {
        if (element.edges[i].id === id) {
            result = element.edges[i];
        }
    }

    for (var i = 0; result == null && i < element.children.length; i++) {
        result = this.searchEdgeInElement(element.children[i], id);
    }

    return result;
};

ThreeViewer.TreeService.prototype.getDependencyNameForId = function (id) {
    var dependencies = this.treeServiceTree.dependencies;
    for (var i = 0; i < dependencies.length; i++) {
        if (id === dependencies[i].id) {
            return dependencies[i].sourceName + " -> "
                + dependencies[i].destinationName;
        }
    }
};

ThreeViewer.TreeService.prototype.getAllSceneElementsRecursive = function (id) {
    var node = this.searchTreeNode(id);
    var showIds = this.privateGetAllSceneElementsRecursive(node);

    /**
     * Remove inbound edges from node and showIds.
     */
    for (var index = 0; index < node.edges.length; index++) {
        var indexInArray = showIds.indexOf(node.edges[index].id);
        if (indexInArray > -1) {
            showIds.splice(indexInArray, 1);
        }
    }

    return showIds;
};

ThreeViewer.TreeService.prototype.contains = function (array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
};

ThreeViewer.TreeService.prototype.privateGetAllSceneElementsRecursive = function (node) {
    var showIds = [];
    showIds.push(node.id);

    // children nodes
    for (var i = 0; i < node.children.length; i++) {
        var result = this.privateGetAllSceneElementsRecursive(node.children[i]);
        showIds = showIds.concat(result);
    }

    // edges
    for (var j = 0; j < node.edges.length; j++) {
        showIds.push(node.edges[j].id);
    }

    return showIds;
};

ThreeViewer.TreeService.prototype.getInboundEdges = function (node) {
    var result = [];
    if (node.parentInfo) {
        var parent = this.searchTreeNode(node.parentInfo.id);

        for (var i = 0; i < parent.children.length; i++) {
            var child = parent.children[i];
            for (var j = 0; j < child.edges.length; j++) {
                var edge = child.edges[j];
                if (edge.destinationId === node.id) {
                    result.push(edge);
                }
            }
        }
    }

    return result;
};

ThreeViewer.TreeService.prototype.getAllDependentEdgeIds = function (includingDependencyIds) {
    var edgeIds = this.privateGetAllDependentEdgeIds(this.treeServiceTree, includingDependencyIds);

    // remove duplicates
    edgeIds.sort();
    var lastId = "";

    for (var index = 0; index < edgeIds.length; index++) {
        if (lastId == edgeIds[index]) {
            edgeIds.splice(index, 1);
            index--;
        } else {
            lastId = edgeIds[index];
        }
    }

    return edgeIds;
};

ThreeViewer.TreeService.prototype.privateGetAllDependentEdgeIds = function (node, includingDependencies) {
    var edgeIds = [];

    // children nodes
    for (var i = 0; i < node.children.length; i++) {
        var result = this.privateGetAllDependentEdgeIds(node.children[i], includingDependencies);
        edgeIds = edgeIds.concat(result);
    }

    // edges
    for (var j = 0; j < node.edges.length; j++) {
        var edge = node.edges[j];

        for (var k = 0; k < edge.includingDependencies.length; k++) {
            if (this.contains(includingDependencies, edge.includingDependencies[k].id)) {
                edgeIds.push(edge.id);
                break;
            }
        }
    }

    return edgeIds;
};