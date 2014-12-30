/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */


softVis3dAngular.filter('inDisplay', function() {
    return function(nodeName) {
        if (nodeName.indexOf("elevatorNode_") > -1) {
            return "From parent layer"
        } else {
            return nodeName;
        }
    };
});

softVis3dAngular.filter('outDisplay', function() {
    return function(nodeName) {
        if (nodeName.indexOf("elevatorNode_") > -1) {
            return "To parent layer"
        } else {
            return nodeName;
        }
    };
});