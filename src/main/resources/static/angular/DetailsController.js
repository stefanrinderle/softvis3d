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
            };

            $rootScope.$on('objectSelected', function(event, id) {
                $scope.showDetails(id);
            });

            $scope.selectNodeFromDetails = function (node) {
                sceneObjectsService.selectSceneObjects(node.id);
                $scope.showDetails(node.id);
            };

            $scope.getDependencyForId = function (id) {
                return treeService.getDependencyForId(id);
            };

            $scope.showAllSceneElements = function () {
                sceneObjectsService.showAllSceneElements();
            };

            $scope.hideAllSceneElementsExceptIdTree = function (id) {
                var showIds = treeService.getAllSceneElementsRecursive(id);
                sceneObjectsService.hideAllSceneElementsExceptIds(showIds);
            };
        }
    ]
);