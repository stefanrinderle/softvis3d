/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
softVis3dAngular.controller('DetailsController',
    ['$rootScope', '$scope', 'backendService', 'treeService', 'sceneObjectsService',
        function ($rootScope, $scope, backendService, treeService, sceneObjectsService) {

            $scope.node = null;

            $scope.showDetails = function (snapshotId) {
                $scope.node = treeService.searchTree(snapshotId);
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

//            $scope.triggerVisible = function () {
//                var selectId;
//                if ($scope.node.parentInfo == null) {
//                    selectId = $scope.node.id;
//                } else {
//                    selectId = $scope.node.parentInfo.id;
//                }
//
//                if ($scope.node.isHidden != null && $scope.node.isHidden) {
//                    console.log("show");
//                    $scope.node.isHidden = false;
////                          showAll($scope.node.id, selectId);
//                } else {
//                    console.log("hide");
//                    $scope.node.isHidden = true;
////                          hideAll($scope.node.id, selectId);
//                }
//            };

            $scope.loadTree = function (snapshotId, footprintMetricId, heightMetricId, viewType) {
                backendService.getTreeForSnapshotView(snapshotId, footprintMetricId, heightMetricId, viewType)
                    .then(function (response) {
                        treeService.setTree(response);
                        //42725 --> root node
                        //42727 --> Java class
                        $scope.showDetails(snapshotId);
                    });
            };

        }
    ]
);