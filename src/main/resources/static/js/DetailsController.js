/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
softVis3dAngular.controller('DetailsController',
    ['$rootScope', '$scope', 'treeService', 'sceneObjectsService',
        function ($rootScope, $scope, treeService, sceneObjectsService) {

            $scope.node = null;
            $scope.displayChildren = false;

            $scope.inEdges = [];
            $scope.outEdges = [];
            $scope.displayEdges = false;

            $scope.edge = null;
            $scope.edgeIncludingEdges = null;
            $scope.displayEdgeIncludingEdges = false;

            $scope.showDetails = function (softVis3dId, type) {
                if (type == "dependency") {
                    $scope.node = null;
                    $scope.edge = treeService.searchEdge(softVis3dId)
                    $scope.privateShowEdgeEdgeDetails($scope.edge);
                    $scope.inEdges = [];
                    $scope.outEdges = [];
                } else {
                    $scope.node = treeService.searchTreeNode(softVis3dId);
                    $scope.privateShowNodeEdgeDetails($scope.node);
                    $scope.edge = null;
                    $scope.edgeIncludingEdges = null;
                    $scope.displayEdgeIncludingEdges = false;
                }
            };

            $scope.privateShowNodeEdgeDetails = function (sourceNode) {
                $scope.outEdges = [];
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
                            treeService.getDependencyNameForId(targetEdge.includingDependencies[j].id);
                    }

                    $scope.outEdges.push(targetEdge);
                }

                $scope.inEdges = [];
                // inbound dependencies
                var inboundEdges = treeService.getInboundEdges(sourceNode);
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
                            treeService.getDependencyNameForId(targetEdge.includingDependencies[j].id);
                    }

                    $scope.inEdges.push(targetEdge);
                }
            };

            $scope.privateShowEdgeEdgeDetails = function (sourceEdge) {
                $scope.edgeIncludingEdges = [];

                for (var j = 0; j < sourceEdge.includingDependencies.length; j++) {
                    var result = {};
                    result.id = sourceEdge.includingDependencies[j].id;
                    result.displayValue = treeService.getDependencyNameForId(sourceEdge.includingDependencies[j].id);

                    $scope.edgeIncludingEdges.push(result);
                }
            };

            $scope.selectAllDependentDependencies = function (edge) {
                var clearedIncludingDependencyIds = [];
                for (var index = 0; index < edge.includingDependencies.length; index++) {
                    clearedIncludingDependencyIds.push(edge.includingDependencies[index].id);
                }

                $scope.selectAllDependentDependenciesByIds(clearedIncludingDependencyIds);
            };

            $scope.selectAllDependentDependenciesById = function (dependencyId) {
                var ids = [];
                ids.push(dependencyId);
                $scope.selectAllDependentDependenciesByIds(ids);
            };

            $scope.selectAllDependentDependenciesByIds = function (includingDependencyIds) {
                var edgeIds = treeService.getAllDependentEdgeIds(includingDependencyIds);
                sceneObjectsService.selectSceneEdgeObjects(edgeIds);
            };

            $rootScope.$on('objectSelected', function (event, id, type) {
                if (type === "dependency") {
                    var edgeIds = [];
                    edgeIds.push(id);
                    sceneObjectsService.selectSceneEdgeObjects(edgeIds);
                } else {
                    sceneObjectsService.selectSceneTreeObject(id);
                }

                $scope.showDetails(id, type);
            });

            $scope.selectSceneObjectFromDetails = function (objectId, type) {
                if (type === "dependency") {
                    var edgeIds = [];
                    edgeIds.push(objectId);
                    sceneObjectsService.selectSceneEdgeObjects(edgeIds);
                } else {
                    sceneObjectsService.selectSceneTreeObject(objectId);
                }

                $scope.showDetails(objectId, type);
            };

            $scope.showAllSceneElements = function () {
                sceneObjectsService.showAllSceneElements();
            };

            $scope.hideAllSceneElementsExceptIdTree = function (id) {
                var showIds = treeService.getAllSceneElementsRecursive(id);
                sceneObjectsService.hideAllSceneElementsExceptIds(showIds);
                sceneObjectsService.removeObject(id, "leaf");
            };

            $scope.triggerDisplayChildren = function () {
                if ($scope.displayChildren) {
                    $scope.displayChildren = false;
                } else {
                    $scope.displayChildren = true;
                }
            };

            $scope.triggerDisplayEdges = function () {
                if ($scope.displayEdges) {
                    $scope.displayEdges = false;
                } else {
                    $scope.displayEdges = true;
                }
            };

            $scope.triggerDisplayEdgeDetails = function (edge) {
                if (edge.displayDetails) {
                    edge.displayDetails = false;
                } else {
                    edge.displayDetails = true;
                }
            };

            $scope.triggerDisplayEdgeIncludingEdges = function () {
                if ($scope.displayEdgeIncludingEdges) {
                    $scope.displayEdgeIncludingEdges = false;
                } else {
                    $scope.displayEdgeIncludingEdges = true;
                }
            };

        }
    ]
);

softVis3dAngular.filter('inDisplay', function () {
    return function (nodeName) {
        if (nodeName.indexOf("elevatorNode_") > -1) {
            return "From parent layer"
        } else {
            return nodeName;
        }
    };
});

softVis3dAngular.filter('outDisplay', function () {
    return function (nodeName) {
        if (nodeName.indexOf("elevatorNode_") > -1) {
            return "To parent layer"
        } else {
            return nodeName;
        }
    };
});