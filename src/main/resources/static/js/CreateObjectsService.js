/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
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

                createPlatform: function (platform) {
                    var position = [];
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

                createBuilding: function (building) {
                    var nodeMaterial = new THREE.MeshLambertMaterial({
                        color: building.color,
                        transparent: true,
                        opacity: 1
                    });

                    var nodeGeometry = new THREE.BoxGeometry(
                        building.width, building.buildingHeight, building.height);

                    var position = [];
                    position.x = building.positionX;
                    position.y = building.height3d + building.buildingHeight / 2;
                    position.z = building.positionY;

                    service.createBox(nodeGeometry, nodeMaterial, position, building.id, "leaf");

                    for (var i = 0; i < building.arrows.length; i++) {
                        service.createArrow(building.arrows[i]);
                    }
                },

                createBox: function (geometry, material, position, id, type) {
                    var object = new THREE.Mesh(geometry, material);

                    object.position.x = position.x;
                    object.position.y = position.y;
                    object.position.z = position.z;

                    object.softVis3dId = id;
                    object.softVis3dType = type;

                    sceneObjectsService.push(object);
                },

                createArrow: function (arrow) {
                    service.createSpline(arrow);

                    var pointsLength = arrow.translatedPoints.length;
                    service.createArrowHead(arrow.translatedPoints[pointsLength - 2],
                        arrow.translatedPoints[pointsLength - 1],
                        arrow);
                },

                createSpline: function (arrow) {
                    var radius = 1 + (10 * (arrow.radius / 100));
                    // NURBS curve

                    var nurbsControlPoints = [];
                    var nurbsKnots = [];
                    var nurbsDegree = 3;

                    for (var i = 0; i <= nurbsDegree; i++) {

                        nurbsKnots.push(0);

                    }

                    for (var i = 0; i < arrow.translatedPoints.length; i++) {
                        nurbsControlPoints.push(
                            new THREE.Vector4(
                                arrow.translatedPoints[i].x,
                                arrow.translatedPoints[i].y,
                                arrow.translatedPoints[i].z,
                                1 // weight of control point: higher means stronger attraction
                            )
                        );

                        var knot = ( i + 1 ) / ( arrow.translatedPoints.length - nurbsDegree );
                        nurbsKnots.push(THREE.Math.clamp(knot, 0, 1));

                    }

                    var nurbsCurve = new THREE.NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);

                    var nurbsGeometry = new THREE.Geometry();
                    nurbsGeometry.vertices = nurbsCurve.getPoints(200);
                    var nurbsMaterial = new THREE.LineBasicMaterial({ linewidth: radius, color: arrow.color, transparent: true });

                    var nurbsLine = new THREE.Line(nurbsGeometry, nurbsMaterial);
                    nurbsLine.softVis3dId = arrow.id;
                    nurbsLine.softVis3dType = "dependency";
                    sceneObjectsService.push(nurbsLine);
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
                    var radius = 1 + (10 * (arrow.radius / 100));

                    // add head
                    /* cylinder: radiusAtTop, radiusAtBottom,
                     height, radiusSegments, heightSegments */
                    var edgeHeadGeometry = new THREE.CylinderGeometry(1, radius + 3, 10, 8, 1);
                    var edgeHead = new THREE.Mesh(edgeHeadGeometry,
                        new THREE.MeshBasicMaterial({ color: "#000000" }));

                    edgeHead.applyMatrix(orientation);
                    edgeHead.applyMatrix(new THREE.Matrix4().makeTranslation(
                        pointYVector.x, pointYVector.y, pointYVector.z));

                    edgeHead.softVis3dId = arrow.id;
                    edgeHead.softVis3dType = "dependency";
                    sceneObjectsService.push(edgeHead);
                },

                createVectorFromPoint: function (point) {
                    return new THREE.Vector3(point.x, point.y, point.z);
                }

            };

            return service;
        }]);