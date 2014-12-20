/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
//    function showAll(id, selectId) {
//        showNodeAndAllParents(id);
//        selectSceneObject(selectId);
//    }
//
//    function showNode(id, selectId) {
//        showNodeAndChildren(id);
//        selectSceneObjectByType(selectId, "node");
//    }
//
//    function showNodeAndAllParents(id) {
//        showSingleNode(id);
//
//        var node = searchTree(id);
//        if (node != null) {
//            node.isHidden = false;
//            for (var index = 0; index < node.children.length; index++) {
//                showNodeAndAllParents(node.children[index].id);
//            }
//        }
//    }
//
//    function showSingleNode(id) {
//        for (var index = 0; index < objects.length; index++) {
//            if (id == objects[index].softVis3DId) {
//                scene.add(objects[index]);
//                objectsInView[index] = objects[index];
//            }
//        }
//    }
//
//    function showEdge(id) {
//        for (var index = 0; index < objects.length; index++) {
//            if (id == objects[index].softVis3DId) {
//                scene.add(objects[index]);
//                objectsInView[index] = objects[index];
//            }
//        }
//    }
//
//    function showSingleNodeByType(id, type) {
//        for (var index = 0; index < objects.length; index++) {
//            if (id == objects[index].softVis3DId && type == objects[index].type) {
//                scene.add(objects[index]);
//                objectsInView[index] = objects[index];
//            }
//        }
//    }
//
//    function hideAll(id, selectId) {
//        removeNodeAndAllChildren(id);
//        selectSceneObject(selectId);
//    }
//
//    function removeNodeAndAllChildren(id) {
//        removeNode(id);
//
//        var node = searchTree(id);
//        if (node != null) {
//            node.isHidden = true;
//            for (var index = 0; index < node.children.length; index++) {
//                removeNodeAndAllChildren(node.children[index].id);
//            }
//        }
//    }
//
//    var emptyObjectMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBF00, opacity: 0.5 });
//    var emptyObjectGeometry = new THREE.BoxGeometry(0, 0, 0);
//    var emptyObject = new THREE.Mesh(emptyObjectGeometry, emptyObjectMaterial);
//    emptyObject.position.x = 0;
//    emptyObject.position.y = 0;
//    emptyObject.position.z = 0;
//
//    function removeNode(id) {
//        for (var index = 0; index < objects.length; index++) {
//            if (id == objects[index].softVis3DId) {
//                objectsInView[index] = emptyObject;
//                scene.remove(objects[index]);
//            }
//        }
//    }
//
//    function hideNode(id, selectId) {
//        removeNodeAndChildren(id);
//        selectSceneObjectByType(selectId, "node");
//    }
//
//    function removeNodeAndChildren(id) {
//        removeNodeByType(id, "node");
//
//        var node = searchTree(id);
//        if (node != null) {
//            node.isHidden = true;
//            for (var index = 0; index < node.children.length; index++) {
//                removeNodeByType(node.children[index].id, "leaf");
//                node.children[index].parentInfo.isHidden = true;
//
//                for (var k = 0; k < node.children[index].edges.length; k++) {
//                    removeEdge(node.children[index].edges[k].id);
//                }
//            }
//        }
//    }
//
//    function removeEdge(id) {
//        for (var index = 0; index < objects.length; index++) {
//            if (id == objects[index].softVis3DId) {
//                objectsInView[index] = emptyObject;
//                scene.remove(objects[index]);
//            }
//        }
//    }
//
//    function removeNodeByType(id, type) {
//        for (var index = 0; index < objects.length; index++) {
//            if (id == objects[index].softVis3DId && type == objects[index].type) {
//                objectsInView[index] = emptyObject;
//                scene.remove(objects[index]);
//            }
//        }
//    }
//
//    function showNodeAndChildren(id) {
//        showSingleNodeByType(id, "node");
//
//        var node = searchTree(id);
//        if (node != null) {
//            node.isHidden = false;
//            for (var index = 0; index < node.children.length; index++) {
//                showSingleNode(node.children[index].id);
//                node.children[index].isHidden = false;
//                node.children[index].parentInfo.isHidden = false;
//
//                for (var k = 0; k < node.children[index].edges.length; k++) {
//                    showEdge(node.children[index].edges[k].id);
//                }
//            }
//        }
//    }