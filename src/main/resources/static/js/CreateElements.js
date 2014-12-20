/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */

function createBox(geometry, material, position, id, type) {
    var object = new THREE.Mesh(geometry, material);

    object.position.x = position.x;
    object.position.y = position.y;
    object.position.z = position.z;

    object.softVis3DId = id;
    object.type = type;

    angular.element(document.getElementById('detailsContainer')).scope().pushObject(object);
//    objects.push(object);
    objectsInView.push(object);

    scene.add(object);
};

function drawCylinder(pointXx, pointXy, pointXz, pointYx, pointYy, pointYz, id, thickness) {
    var pointX = createVector(pointXx, pointXy, pointXz);
    var pointY = createVector(pointYx, pointYy, pointYz);
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
    scene.add(edge);
    angular.element(document.getElementById('detailsContainer')).scope().pushObject(edge);
//    objects.push(edge);
    objectsInView.push(edge);

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
    scene.add(edgeHead);
    angular.element(document.getElementById('detailsContainer')).scope().pushObject(edgeHead);
//    objects.push(edgeHead);
    objectsInView.push(edgeHead);
}

function createVector(x, y, z) {
    return new THREE.Vector3(x, y, z);
}