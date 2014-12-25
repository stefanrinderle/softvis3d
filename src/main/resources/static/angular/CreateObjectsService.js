/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
softVis3dAngular.factory('createObjectsService',
    ['sceneObjectsService',
        function (sceneObjectsService) {
            var service = {

                createObjects: function (platformArray) {
                    for (var i = 0; i < platformArray.webserviceResult.length; i++) {
                        service.createPlatform(platformArray.webserviceResult[i]);
                    }
                },

                createPlatform: function(platform) {
                    var position = new Array();
                    position.x = platform.positionX;
                    position.y = platform.height3d;
                    position.z = platform.positionY;

                    var geometryLayer = new THREE.BoxGeometry(
                        platform.width, platform.platformHeight, platform.height);

                    var layerMaterial = new THREE.MeshLambertMaterial({
                        color: platform.color,
                        transparent: true,
                        opacity: platform.opacity
                    });

                    service.createBox(geometryLayer, layerMaterial, position, platform.platformId, "node");

                    for (var i = 0; i < platform.nodes.length; i++) {
                        service.createBuilding(platform.nodes[i]);
                    }
                },

                createBuilding: function(building) {
                    var nodeMaterial = new THREE.MeshLambertMaterial({
                        color: building.color,
                        transparent: true,
                        opacity: 1
                    });

                    var nodeGeometry = new THREE.BoxGeometry(
                        building.width, building.buildingHeight, building.height);

                    var position = new Array();
                    position.x = building.positionX;
                    position.y = building.height3d + building.buildingHeight / 2;
                    position.z = building.positionY;

                    service.createBox(nodeGeometry, nodeMaterial, position, building.id, "leaf");

                    for (var i = 0; i < building.arrows.length; i++) {
                        service.createArrow(building.arrows[i]);
                    }
                },

                createBox: function(geometry, material, position, id, type) {
                    var object = new THREE.Mesh(geometry, material);

                    object.position.x = position.x;
                    object.position.y = position.y;
                    object.position.z = position.z;

                    object.softVis3DId = id;
                    object.type = type;

                    sceneObjectsService.push(object);
                },

                createArrow: function(arrow) {
                    service.createSpline(arrow);

                    var pointsLength = arrow.translatedPoints.length;
                    service.createArrowHead(arrow.translatedPoints[pointsLength - 2],
                        arrow.translatedPoints[pointsLength - 1],
                        arrow);
                },

                createSpline: function (arrow) {
                    console.log("create spline");

                    var radius = 10 * (arrow.radius / 100);

                    var vectorPointArray = [];
                    for (var i = 0; i < arrow.translatedPoints.length; i++) {
                        vectorPointArray.push(service.createVectorFromPoint(arrow.translatedPoints[i]));
                    }

                    var geometry = new THREE.TubeGeometry(
                        new THREE.SplineCurve3(vectorPointArray),
                            vectorPointArray.length * 2, radius, 8, false);
                    var material = new THREE.MeshBasicMaterial({
                        color: arrow.color
                    });
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.softVis3DId = arrow.id;
                    sceneObjectsService.push(mesh);
                },

                createArrowHead: function (startPoint, endPoint, arrow) {
                    var pointXVector = service.createVectorFromPoint(startPoint);
                    var pointYVector = service.createVectorFromPoint(endPoint);
                    var orientation = new THREE.Matrix4();
                    /* THREE.Object3D().up (=Y) default orientation for all objects */
                    orientation.lookAt(pointXVector, pointYVector, new THREE.Object3D().up);
                    /* rotation around axis X by -90 degrees
                     * matches the default orientation Y
                     * with the orientation of looking Z */
                    orientation.multiply(new THREE.Matrix4(1, 0, 0, 0,
                        0, 0, 1, 0,
                        0, -1, 0, 0,
                        0, 0, 0, 1));

                    /* thickness is in percent at the moment */
                    var radius = 10 * (arrow.radius / 100);

                    // add head
                    /* cylinder: radiusAtTop, radiusAtBottom,
                     height, radiusSegments, heightSegments */
                    var edgeHeadGeometry = new THREE.CylinderGeometry(1, radius + 3, 10, 8, 1);
                    var edgeHead = new THREE.Mesh(edgeHeadGeometry,
                        new THREE.MeshBasicMaterial({ color: arrow.color }));

                    edgeHead.applyMatrix(orientation);
                    edgeHead.applyMatrix(new THREE.Matrix4().makeTranslation(
                        pointYVector.x, pointYVector.y, pointYVector.z));

                    edgeHead.softVis3DId = arrow.id;
                    sceneObjectsService.push(edgeHead);
                },

                createVectorFromPoint: function (point) {
                    return new THREE.Vector3(point.x, point.y, point.z);
                }

            };

            return service;
        }]);