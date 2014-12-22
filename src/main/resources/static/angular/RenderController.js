/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
softVis3dAngular.controller('RenderController',
    ['$rootScope', '$scope', 'sceneObjectsService',
        function ($rootScope, $scope, sceneObjectsService) {

            $scope.isVisualisationActive = false;
            $scope.clickOrDragFlag = false;

            $scope.init = function (snapshotId, metric1, metric2, viewType) {
                if (snapshotId != "" && metric1 != "" && metric2 != "" && viewType != "") {
                    $scope.initVisualization(snapshotId, metric1, metric2, viewType);
                }
            };

            $scope.initVisualization = function (snapshotId, metric1, metric2, viewType) {
                $scope.isVisualisationActive = true;

                sceneObjectsService.initScene();
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
                if($scope.clickOrDragFlag){
                    // drag
                    $scope.clickOrDragFlag = false;
                } else {
                    // click
                    var intersectedObject = sceneObjectsService.intersectClickEvent(event);

                    if (intersectedObject != null) {
                        $rootScope.$broadcast('objectSelected', intersectedObject.softVis3DId, intersectedObject.type);
                    }
                }
            };

            $scope.createBox = function(geometry, material, position, id, type) {
                var object = new THREE.Mesh(geometry, material);

                object.position.x = position.x;
                object.position.y = position.y;
                object.position.z = position.z;

                object.softVis3DId = id;
                object.type = type;

                $scope.pushObject(object);
            };

            $scope.drawCylinder = function (pointXx, pointXy, pointXz, pointYx, pointYy, pointYz, id, thickness) {
                var pointX = $scope.createVector(pointXx, pointXy, pointXz);
                var pointY = $scope.createVector(pointYx, pointYy, pointYz);
                /* edge from X to Y */
                var direction = new THREE.Vector3().subVectors(pointY, pointX);
                var orientation = new THREE.Matrix4();
                /* THREE.Object3D().up (=Y) default orientation for all objects */
                orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
                /* rotation around axis X by -90 degrees
                 * matches the default orientation Y
                 * with the orientation of looking Z */
                orientation.multiply(new THREE.Matrix4(1, 0, 0, 0,
                    0, 0, 1, 0,
                    0, -1, 0, 0,
                    0, 0, 0, 1));

                /* cylinder: radiusAtTop, radiusAtBottom,
                 height, radiusSegments, heightSegments */

                /* thickness is in percent at the moment */
                var radius = 10 * (thickness / 100);
                var edgeGeometry = new THREE.CylinderGeometry(radius, radius, direction.length(), 8, 1);
                var edge = new THREE.Mesh(edgeGeometry,
                    new THREE.MeshBasicMaterial({ color: 0xff0000 }));

                edge.applyMatrix(orientation);
                direction = direction.multiplyScalar(0.5);

                edge.applyMatrix(new THREE.Matrix4().makeTranslation(
                        pointX.x + direction.x, pointX.y + direction.y, pointX.z + direction.z));

                edge.softVis3DId = id;
                $scope.pushObject(edge);

                // add head
                /* cylinder: radiusAtTop, radiusAtBottom,
                 height, radiusSegments, heightSegments */
                var edgeHeadGeometry = new THREE.CylinderGeometry(1, radius + 3, 10, 8, 1);
                var edgeHead = new THREE.Mesh(edgeHeadGeometry,
                    new THREE.MeshBasicMaterial({ color: 0xff0000 }));

                edgeHead.applyMatrix(orientation);
                edgeHead.applyMatrix(new THREE.Matrix4().makeTranslation(
                    pointY.x, pointY.y, pointY.z));

                edgeHead.softVis3DId = id;
                $scope.pushObject(edgeHead);
            }

            $scope.createVector = function (x, y, z) {
                return new THREE.Vector3(x, y, z);
            }

            // this is only a facade to the service, refactor later
            $scope.pushObject = function (object) {
                sceneObjectsService.push(object);
            };
        }]
);