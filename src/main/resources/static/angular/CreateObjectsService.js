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

                createArrow: function(arrow) {
                    service.drawCylinder(arrow.originX, arrow.originY, arrow.originZ,
                        arrow.destinationX, arrow.destinationY, arrow.destinationZ,
                            "'" + arrow.tailId + " -> " + arrow.headId, arrow.radius)
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

                drawCylinder: function (pointXx, pointXy, pointXz, pointYx, pointYy, pointYz, id, thickness) {
                    var pointX = service.createVector(pointXx, pointXy, pointXz);
                    var pointY = service.createVector(pointYx, pointYy, pointYz);
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
                    sceneObjectsService.push(edge);

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
                    sceneObjectsService.push(edgeHead);
                },

                createVector: function (x, y, z) {
                    return new THREE.Vector3(x, y, z);
                }
            };

            return service;
        }]);