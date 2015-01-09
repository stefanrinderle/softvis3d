/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
softVis3dAngular.controller('RenderController',
    ['$rootScope', '$scope', 'sceneObjectsService', 'backendService', 'createObjectsService', 'treeService',
        function ($rootScope, $scope, sceneObjectsService, backendService, createObjectsService, treeService) {

            $scope.isVisualisationActive = false;
            $scope.isLoading = false;

            $scope.clickOrDragFlag = false;

            $scope.webserviceVisualizationResult = null;

            /**
             * Method which should be called to visualize a project.
             */
            $scope.loadVisualization = function (snapshotId, footprintMetricId, heightMetricId, viewType) {
                $scope.isLoading = true;

                backendService.getVisualization(snapshotId, footprintMetricId, heightMetricId, viewType)
                    .then(function (response) {
                        $scope.loadTree(snapshotId, footprintMetricId, heightMetricId, viewType);
                        $scope.showVisualization(response);
                    });
            };

            /**
             * Load the information tree and select root object.
             */
            $scope.loadTree = function (snapshotId, footprintMetricId, heightMetricId, viewType) {
                backendService.getTreeForSnapshotView(snapshotId, footprintMetricId, heightMetricId, viewType)
                    .then(function (response) {
                        treeService.setTree(response);
                        $rootScope.$broadcast('objectSelected', snapshotId, "node");
                    });
            };

            $scope.showVisualization = function (webserviceResponse) {
                $scope.isVisualisationActive = true;
                $scope.isLoading = false;

                sceneObjectsService.initScene();
                createObjectsService.createObjects(webserviceResponse);
            };

            /**
             * Mouse events for drag or click
             */

            $scope.mousedown = function (event) {
                $scope.clickOrDragFlag = false;
            };

            $scope.mousemove = function (event) {
                $scope.clickOrDragFlag = true;
            };

            $scope.mouseup = function (event) {
                if ($scope.clickOrDragFlag) {
                    // drag
                    $scope.clickOrDragFlag = false;
                } else {
                    // click
                    var intersectedObject = sceneObjectsService.intersectClickEvent(event);

                    if (intersectedObject != null) {
                        $rootScope.$broadcast('objectSelected', intersectedObject.softVis3dId, intersectedObject.softVis3dType);
                    }
                }
            };

        }]
);