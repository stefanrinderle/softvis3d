/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
softVis3dAngular.filter('inDisplay', function() {
    return function(nodeName) {
        if (nodeName.indexOf("elevatorNode_") > -1) {
            return "IN"
        } else {
            return nodeName;
        }
    };
});

softVis3dAngular.filter('outDisplay', function() {
    return function(nodeName) {
        if (nodeName.indexOf("elevatorNode_") > -1) {
            return "OUT"
        } else {
            return nodeName;
        }
    };
});

softVis3dAngular.controller('DetailsController',
    ['$rootScope', '$scope', 'treeService', 'sceneObjectsService',
        function ($rootScope, $scope, treeService, sceneObjectsService) {

            $scope.node = null;
            $scope.displayChildren = false;

            $scope.edges = [];
            $scope.displayEdges = false;

            $scope.showDetails = function (snapshotId) {
                $scope.node = treeService.searchTree(snapshotId);

                $scope.edges = [];
                for (var index = 0; index < $scope.node.edges.length; index++) {
                    var sourceEdge = $scope.node.edges[index];
                    var targetEdge = {};
                    targetEdge.id = sourceEdge.id;
                    targetEdge.sourceName = sourceEdge.sourceName;
                    targetEdge.destinationName = sourceEdge.destinationName;
                    // copy including dependencies
                    targetEdge.includingDependencies = sourceEdge.includingDependencies.slice();

                    for(var j = 0; j < targetEdge.includingDependencies.length; j++) {
                        targetEdge.includingDependencies[j].displayValue =
                            treeService.getDependencyForId(targetEdge.includingDependencies[j].id);
                    }

                    $scope.edges.push(targetEdge);
                }
            };

            $rootScope.$on('objectSelected', function(event, id) {
                $scope.showDetails(id);
            });

            $scope.selectNodeFromDetails = function (node) {
                sceneObjectsService.selectSceneObjects(node.id);
                $scope.showDetails(node.id);
            };

            $scope.showAllSceneElements = function () {
                sceneObjectsService.showAllSceneElements();
            };

            $scope.hideAllSceneElementsExceptIdTree = function (id) {
                var showIds = treeService.getAllSceneElementsRecursive(id);
                sceneObjectsService.hideAllSceneElementsExceptIds(showIds);
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

        }
    ]
);