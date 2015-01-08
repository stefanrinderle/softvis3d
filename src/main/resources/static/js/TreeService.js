/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
softVis3dAngular.factory('treeService', [ function () {
    var treeServiceTree = null;
    var service = {
        setTree: function (tree) {
            treeServiceTree = tree;
        },

        searchTreeNode: function (id) {
            if (treeServiceTree != null) {
                return this.searchIdInElement(treeServiceTree, id);
            } else {
                console.warn("search for id " + id + " without initialized the tree.")
            }
        },

        searchIdInElement: function (element, id) {
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
        },

        searchEdge: function (id) {
            return this.searchEdgeInElement(treeServiceTree, id);
        },

        searchEdgeInElement: function (element, id) {
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
        },

        getDependencyNameForId: function (id) {
            var dependencies = treeServiceTree.dependencies;
            for (var i = 0; i < dependencies.length; i++) {
                if (id === dependencies[i].id) {
                    return dependencies[i].sourceName + " -> "
                        + dependencies[i].destinationName;
                }
            }
        },

        getAllSceneElementsRecursive: function (id) {
            var node = service.searchTreeNode(id);
            var showIds = service.privateGetAllSceneElementsRecursive(node);

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
        },

        contains: function (array, obj) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === obj) {
                    return true;
                }
            }
            return false;
        },

        privateGetAllSceneElementsRecursive: function (node) {
            var showIds = [];
            showIds.push(node.id);

            // children nodes
            for (var i = 0; i < node.children.length; i++) {
                var result = service.privateGetAllSceneElementsRecursive(node.children[i]);
                showIds = showIds.concat(result);
            }

            // edges
            for (var j = 0; j < node.edges.length; j++) {
                showIds.push(node.edges[j].id);
            }

            return showIds;
        },

        getInboundEdges: function (node) {
            var result = [];
            if (node.parentInfo) {
                var parent = service.searchTreeNode(node.parentInfo.id);

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
        },

        getAllDependentEdgeIds: function (includingDependencyIds) {
            var edgeIds = service.privateGetAllDependentEdgeIds(treeServiceTree, includingDependencyIds);

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
        },

        privateGetAllDependentEdgeIds: function (node, includingDependencies) {
            var edgeIds = [];

            // children nodes
            for (var i = 0; i < node.children.length; i++) {
                var result = service.privateGetAllDependentEdgeIds(node.children[i], includingDependencies);
                edgeIds = edgeIds.concat(result);
            }

            // edges
            for (var j = 0; j < node.edges.length; j++) {
                var edge = node.edges[j];

                for (var k = 0; k < edge.includingDependencies.length; k++) {
                    if (service.contains(includingDependencies, edge.includingDependencies[k].id)) {
                        edgeIds.push(edge.id);
                        break;
                    }
                }
            }

            return edgeIds;
        }

    };

    return service;
}]);