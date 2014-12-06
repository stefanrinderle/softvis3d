/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */

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
