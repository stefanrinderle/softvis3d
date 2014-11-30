/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
var tree;

function getTreeViaWebserver(snapshotId, footprintMetricId, heightMetricId, viewType) {
    callAjax("../../api/softVis3D/getTree?snapshotId=" + snapshotId
            + "&footprintMetricId=" + footprintMetricId + "&heightMetricId=" + heightMetricId + "&viewType=" + viewType,
        function (response) {
            var myArray = JSON.parse(response);
            console.log(myArray);
            tree = myArray;
        });
}

function searchTree(id) {
    return searchIdInElement(tree, id);
}

function searchIdInElement(element, id) {
    if (element.id == id) {
        return element;
    } else if (element.children != null) {
        var result = null;
        for (var i = 0; result == null && i < element.children.length; i++) {
            result = searchIdInElement(element.children[i], id);
        }
        return result;
    }
    return null;
}

