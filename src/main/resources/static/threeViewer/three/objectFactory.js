/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
goog.provide('Viewer.ObjectFactory');

Viewer.ObjectFactory = function (params) {
    this.context = params.context;
};

Viewer.ObjectFactory.prototype = {
    createObjects: function (platformArray) {
        var result = [];

        for (var i = 0; i < platformArray.length; i++) {
            var platformResult = this.createPlatform(platformArray[i]);
            result = result.concat(platformResult);
        }

        return result;
    },

    createPlatform: function (platform) {
        var result = [];

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

        result.push(this.createBox(geometryLayer, layerMaterial, position, platform.platformId, "node"));

        for (var i = 0; i < platform.nodes.length; i++) {
            var buildingResult = this.createBuilding(platform.nodes[i]);
            result = result.concat(buildingResult);
        }

        return result;
    },

    createBuilding: function (building) {
        var result = [];

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

        result.push(this.createBox(nodeGeometry, nodeMaterial, position, building.id, "leaf"));

        for (var i = 0; i < building.arrows.length; i++) {
            var arrowResult = this.createArrow(building.arrows[i]);
            result = result.concat(arrowResult);
        }

        return result;
    },

    createBox: function (geometry, material, position, id, type) {
        var object = new THREE.Mesh(geometry, material);

        object.position.x = position.x;
        object.position.y = position.y;
        object.position.z = position.z;

        object.softVis3dId = id;
        object.softVis3dType = type;

        return object;
    },

    createArrow: function (arrow) {
        var result = [];

        result.push(this.createSpline(arrow));

        var pointsLength = arrow.translatedPoints.length;

        result.push(this.createArrowHead(arrow.translatedPoints[pointsLength - 2],
            arrow.translatedPoints[pointsLength - 1],
            arrow));

        return result;
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

        var pipeSpline = new THREE.SplineCurve3(nurbsCurve.getPoints(200));

        var tubegeometry = new THREE.TubeGeometry(
                pipeSpline,  //path
                20,    //segments
                radius,     //radius
                8,     //radiusSegments
                false  //closed
        );

        var edgeMesh = new THREE.Mesh(tubegeometry,
                new THREE.MeshBasicMaterial({ color: "#0000ff" }));

        edgeMesh.softVis3dId = arrow.id;
        edgeMesh.softVis3dType = "dependency";

        return edgeMesh;
    },

    createArrowHead: function (startPoint, endPoint, arrow) {
        var pointXVector = this.createVectorFromPoint(startPoint);
        var pointYVector = this.createVectorFromPoint(endPoint);
        var orientation = new THREE.Matrix4();
        /* THREE.Object3D().up (=Y) default orientation for all objects */
        orientation.lookAt(pointXVector, pointYVector, new THREE.Object3D().up);
        /* rotation around axis X by -90 degrees
         * matches the default orientation Y
         * with the orientation of looking Z */
        var multiplyMatrix = new THREE.Matrix4();
        multiplyMatrix.set(1, 0, 0, 0,
            0, 0, 1, 0,
            0, -1, 0, 0,
            0, 0, 0, 1);
        orientation.multiply(multiplyMatrix);

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

        return edgeHead;
    },

    createVectorFromPoint: function (point) {
        return new THREE.Vector3(point.x, point.y, point.z);
    }
};