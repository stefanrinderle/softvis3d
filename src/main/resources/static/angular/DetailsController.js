/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
softVis3dAngular.controller('DetailsController',
    ['$rootScope', '$scope', 'treeService', 'sceneObjectsService',
        function ($rootScope, $scope, treeService, sceneObjectsService) {

            $scope.node = null;

            $scope.showDetails = function (snapshotId) {
                $scope.node = treeService.searchTree(snapshotId);

                if ($scope.node.isHidden == null) {
                    $scope.node.isHidden = false;
                }
            };

            $rootScope.$on('objectSelected', function(event, id) {
                $scope.showDetails(id);
            });

            $scope.selectNodeFromDetails = function (node) {
                if (node.isNode) {
                    sceneObjectsService.selectSceneObjectByType(node.id, "node");
                } else {
                    sceneObjectsService.selectSceneObjectByType(node.id, "leaf");
                }

                $scope.showDetails(node.id);
            };

            $scope.getDependencyForId = function (id) {
                return treeService.getDependencyForId(id);
            };

            $scope.showAllSceneElements = function () {
                treeService.showAllSceneElements();
                sceneObjectsService.showAllSceneElements();
            };

            $scope.triggerVisible = function () {
                var selectId;
                if ($scope.node.parentInfo == null) {
                    selectId = $scope.node.id;
                } else {
                    selectId = $scope.node.parentInfo.id;
                }

                if ($scope.node.isHidden != null && $scope.node.isHidden) {
                    console.log("show");
                    $scope.node.isHidden = false;
                    //                          showAll($scope.node.id, selectId);
                } else {
                    /**
                     * TODO get dependency ids and node ids to remove in two seperated
                     * functions and remove them seperate.
                     */

                    console.log("hide - all nodes and edges from the current platform");
                    var elementIds = treeService.getPlatformElementIds($scope.node.id);

                    console.log("----remove platform elements");

                    for (var index = 0; index < elementIds.length; index++) {
                        sceneObjectsService.removeObject(elementIds[index], "leaf");
                        sceneObjectsService.removeObject(elementIds[index], "dependency");
                    }

                    console.log("----remove platform");
                    sceneObjectsService.removeObject($scope.node.id, "node");

                    $scope.node.isHidden = true;
                    //                          hideAll($scope.node.id, selectId);
                }
            };
        }
    ]
);