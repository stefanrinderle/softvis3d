var tree;

function initializeWebservice(snapshotId, footprintMetricId, heightMetricId, viewType) {
    callAjax("../../api/softViz3d/initialize?snapshotId=" + snapshotId
            + "&footprintMetricId=" + footprintMetricId + "&heightMetricId=" + heightMetricId + "&viewType=" + viewType,
        function (response) {
            var myArray = JSON.parse(response);
            console.log(myArray);
            tree = myArray;
        });
}

function searchTree(id) {
    return searchIdInElememt(tree, id);
}

function searchIdInElememt(element, id) {
    if (element.id == id) {
        return element;
    } else if (element.children != null) {
        var result = null;
        for (var i = 0; result == null && i < element.children.length; i++) {
            result = searchIdInElememt(element.children[i], id);
        }
        return result;
    }
    return null;
}

