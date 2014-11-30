/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
var stats;
var camera, scene, projector, renderer;

var controls;
var objects = [];
var objectsInView = [];

var containerWidth, containerHeight;

var selectedObject, selectedObjectColor;

function init(container, showStats) {
    // header of sonar is 70 px + metric select form 30 px + footer 50 px
    // sidebar 200px
    containerWidth = window.innerWidth - 380;
    containerHeight = window.innerHeight - 170;

    camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 1, 10000);
    camera.position.set(0, 300, 500);

    scene = new THREE.Scene();

    projector = new THREE.Projector();

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, container);
    controls.keyPanSpeed = 30.0;

    if (showStats) {
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.bottom = '0px';
        container.appendChild(stats.domElement);

        controls.addEventListener('change', function render() {
            stats.update();
        });
    }

    document.getElementById("detailsContainer").addEventListener('mousedown', function (e) {
        e.stopPropagation();
    }, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);

    window.addEventListener('resize', onWindowResize, false);

    onWindowResize();
}

function onWindowResize() {
    containerWidth = window.innerWidth - 380;
    containerHeight = window.innerHeight - 170;

    renderer.setSize(containerWidth, containerHeight);
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();

    document.getElementById("detailsContainer").style.height = containerHeight + "px";
}

function onDocumentMouseDown(event) {
    // header of sonar is 70 px + metric select form 30 px
    var mouseVector = new THREE.Vector3(
            2 * ((event.clientX - 170) / containerWidth) - 1,
            1 - 2 * ((event.clientY - 100) / containerHeight),
        0.5);

    var raycaster = projector.pickingRay(mouseVector.clone(), camera);

    var intersects = raycaster.intersectObjects(objectsInView);

    if (intersects.length > 0) {

        // reset former selected object
        if (!!selectedObject) {
            selectedObject.material.color.setHex(selectedObjectColor);
        }

        selectedObject = intersects[ 0 ].object;
        selectedObjectColor = selectedObject.material.color.getHex();
        selectedObject.material.color.setHex(0xFFBF00);

        showDetails(intersects[ 0 ].object.softVis3DId, intersects[ 0 ].object.type);
    }
}

function animate() {
    requestAnimationFrame(animate);

    render();
}

function render() {
    renderer.render(scene, camera);
}

function createBox(geometry, material, position, id, type) {
    var object = new THREE.Mesh(geometry, material);

    object.position.x = position.x;
    object.position.y = position.y;
    object.position.z = position.z;

    object.softVis3DId = id;
    object.type = type;

    objects.push(object);
    objectsInView.push(object);

    scene.add(object);
};

function drawCylinder(pointX, pointY, id, thickness) {
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
    objects.push(edge);
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
    objects.push(edgeHead);
    objectsInView.push(edgeHead);
}

function showDetails(snapshotId, type) {
    var node = searchTree(snapshotId);

    var result = "<h3>Selected</h3>";

    result += node.name + " ";
    result += "(" + node.footprintMetricValue;
    result += "/" + node.heightMetricValue + ")";

    if (viewType == "city") {
        if (node.isNode) {
            var selectId;
            if (node.parentInfo == null) {
                selectId = node.id;
            } else {
                selectId = node.parentInfo.id;
            }

            if (node.isHidden != null && node.isHidden) {
                result += "&nbsp;<button type='button' " +
                    "onclick=\"showAll('" + node.id + "', '" + selectId + "');\">" +
                    "Show all</button>";
            } else {
                result += "&nbsp;<button type='button' " +
                    "onclick=\"hideAll('" + node.id + "', '" + selectId + "');\">" +
                    "Hide all</button>";
            }
        }
    } else if (viewType == "dependency") {
        if (node.isNode && type == "node") {
            if (node.isHidden != null && node.isHidden) {
                result += "&nbsp;<button type='button' " +
                    "onclick=\"showNode('" + node.id + "', '" + node.id + "');\">" +
                    "Show layer</button>";
            } else {
                result += "&nbsp;<button type='button' " +
                    "onclick=\"hideNode('" + node.id + "', '" + node.children[0].id + "');\">" +
                    "Hide layer</button>";
            }
        }
    }

    result += "<br /><br />";

    if (node.parentInfo != null) {
        result += "<h3>Parent</h3>";

        result += "<a href='#' onClick='selectSceneObjectByType(" + node.parentInfo.id + ", \"node\");return false'>";

        result += node.parentInfo.name + " ";
        result += "(" + node.parentInfo.footprintMetricValue;
        result += "/" + node.parentInfo.heightMetricValue + ")";

        result += "</a>";

        if (viewType == "dependency") {
            if (node.parentInfo != null) {
                if (node.parentInfo.isHidden != null && node.parentInfo.isHidden) {
                    result += "&nbsp;<button type='button' " +
                        "onclick=\"showNode('" + node.parentInfo.id + "', '" + node.parentInfo.id + "');\">" +
                        "Show layer</button>";
                } else {
                    result += "&nbsp;<button type='button' " +
                        "onclick=\"hideNode('" + node.parentInfo.id + "', '" + node.id + "');\">" +
                        "Hide layer</button>";
                }
            }
        }

        result += "<br /><br />";
    }

    result += "<h3>Children</h3>";
    var children = node.children;
    for (var index = 0; index < children.length; ++index) {
        var child = children[index];

        if (child.isNode) {
            result += "<a href='#' onClick='selectSceneObjectByType(" + child.id + ", \"node\");return false'>";
        } else {
            result += "<a href='#' onClick='selectSceneObject(" + child.id + ");return false'>";
        }

        result += child.name + " ";
        result += "(" + child.footprintMetricValue;
        result += "/" + child.heightMetricValue + ")";

        result += "</a>";

        if (viewType == "city") {
            if (child.isNode) {
                var selectId;
                if (child.parentInfo == null) {
                    selectId = child.id;
                } else {
                    selectId = child.parentInfo.id;
                }

                if (child.isHidden != null && child.isHidden) {
                    result += "&nbsp;<button type='button' " +
                        "onclick=\"showAll('" + child.id + "', '" + selectId + "');\">" +
                        "Show all</button>";
                } else {
                    result += "&nbsp;<button type='button' " +
                        "onclick=\"hideAll('" + child.id + "', '" + selectId + "');\">" +
                        "Hide all</button>";
                }
            }
        }
        result += "<br />";
    }

    document.getElementById('detailsContainer').innerHTML = result;
}

function selectSceneObject(id) {
    for (var index = 0; index < objects.length; index++) {
        if (id == objects[index].softVis3DId) {
            // reset former selected object
            if (!!selectedObject) {
                selectedObject.material.color.setHex(selectedObjectColor);
            }

            selectedObject = objects[index];
            selectedObjectColor = selectedObject.material.color.getHex();
            selectedObject.material.color.setHex(0xFFBF00);

            showDetails(objects[index].softVis3DId, objects[index].type);
        }
    }
}

function selectSceneObjectByType(id, type) {
    for (var index = 0; index < objects.length; index++) {
        if (id == objects[index].softVis3DId && type == objects[index].type) {
            // reset former selected object
            if (!!selectedObject) {
                selectedObject.material.color.setHex(selectedObjectColor);
            }

            selectedObject = objects[index];
            selectedObjectColor = selectedObject.material.color.getHex();
            selectedObject.material.color.setHex(0xFFBF00);

            showDetails(objects[index].softVis3DId, objects[index].type);
        }
    }
}

function showAll(id, selectId) {
    showNodeAndAllParents(id);
    selectSceneObject(selectId);
}

function showNode(id, selectId) {
    showNodeAndChildren(id);
    selectSceneObjectByType(selectId, "node");
}

function showNodeAndAllParents(id) {
    showSingleNode(id);

    var node = searchTree(id);
    if (node != null) {
        node.isHidden = false;
        for (var index = 0; index < node.children.length; index++) {
            showNodeAndAllParents(node.children[index].id);
        }
    }
}

function showSingleNode(id) {
    for (var index = 0; index < objects.length; index++) {
        if (id == objects[index].softVis3DId) {
            scene.add(objects[index]);
            objectsInView[index] = objects[index];
        }
    }
}

function showEdge(id) {
    for (var index = 0; index < objects.length; index++) {
        if (id == objects[index].softVis3DId) {
            scene.add(objects[index]);
            objectsInView[index] = objects[index];
        }
    }
}

function showSingleNodeByType(id, type) {
    for (var index = 0; index < objects.length; index++) {
        if (id == objects[index].softVis3DId && type == objects[index].type) {
            scene.add(objects[index]);
            objectsInView[index] = objects[index];
        }
    }
}

function hideAll(id, selectId) {
    removeNodeAndAllChildren(id);
    selectSceneObject(selectId);
}

function removeNodeAndAllChildren(id) {
    removeNode(id);

    var node = searchTree(id);
    if (node != null) {
        node.isHidden = true;
        for (var index = 0; index < node.children.length; index++) {
            removeNodeAndAllChildren(node.children[index].id);
        }
    }
}

var emptyObjectMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBF00, opacity: 0.5 });
var emptyObjectGeometry = new THREE.BoxGeometry(0, 0, 0);
var emptyObject = new THREE.Mesh(emptyObjectGeometry, emptyObjectMaterial);
emptyObject.position.x = 0;
emptyObject.position.y = 0;
emptyObject.position.z = 0;

function removeNode(id) {
    for (var index = 0; index < objects.length; index++) {
        if (id == objects[index].softVis3DId) {
            objectsInView[index] = emptyObject;
            scene.remove(objects[index]);
        }
    }
}

function hideNode(id, selectId) {
    removeNodeAndChildren(id);
    selectSceneObjectByType(selectId, "node");
}

function removeNodeAndChildren(id) {
    removeNodeByType(id, "node");

    var node = searchTree(id);
    if (node != null) {
        node.isHidden = true;
        for (var index = 0; index < node.children.length; index++) {
            removeNodeByType(node.children[index].id, "leaf");
            node.children[index].parentInfo.isHidden = true;

            for (var k = 0; k < node.children[index].edges.length; k++) {
                removeEdge(node.children[index].edges[k].id);
            }
        }
    }
}

function removeEdge(id) {
    for (var index = 0; index < objects.length; index++) {
        if (id == objects[index].softVis3DId) {
            objectsInView[index] = emptyObject;
            scene.remove(objects[index]);
        }
    }
}

function removeNodeByType(id, type) {
    for (var index = 0; index < objects.length; index++) {
        if (id == objects[index].softVis3DId && type == objects[index].type) {
            objectsInView[index] = emptyObject;
            scene.remove(objects[index]);
        }
    }
}

function showNodeAndChildren(id) {
    showSingleNodeByType(id, "node");

    var node = searchTree(id);
    if (node != null) {
        node.isHidden = false;
        for (var index = 0; index < node.children.length; index++) {
            showSingleNode(node.children[index].id);
            node.children[index].isHidden = false;
            node.children[index].parentInfo.isHidden = false;

            for (var k = 0; k < node.children[index].edges.length; k++) {
                showEdge(node.children[index].edges[k].id);
            }
        }
    }
}

function setLight() {
    var light = new THREE.DirectionalLight(0xaaaaaa);
    light.position.set(1, 0, 0).normalize();
    scene.add(light);

    var light = new THREE.DirectionalLight(0xcccccc);
    light.position.set(-1, 0, 0).normalize();
    scene.add(light);

    var light = new THREE.DirectionalLight(0xddddddd);
    light.position.set(0, 0, 1).normalize();
    scene.add(light);

    var light = new THREE.DirectionalLight(0xeeeeee);
    light.position.set(0, 0, -1).normalize();
    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
};
