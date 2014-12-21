/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
softVis3dAngular.factory('sceneObjectsService', [ function(){
    var sceneObjectsServiceObjects = [];
    var selectedObject = null;
    var selectedObjectColor = null;

    return {
        push : function (object) {
            sceneObjectsServiceObjects.push(object);
        },

        selectSceneObjectByType : function (id, type) {
            console.log("selectSceneObjectByType " + id + " " + type);
            for (var index = 0; index < sceneObjectsServiceObjects.length; index++) {
                if (id == sceneObjectsServiceObjects[index].softVis3DId && type == sceneObjectsServiceObjects[index].type) {
                    // reset former selected object
                    if (!!selectedObject) {
                        selectedObject.material.color.setHex(selectedObjectColor);
                    }

                    selectedObject = sceneObjectsServiceObjects[index];
                    selectedObjectColor = selectedObject.material.color.getHex();
                    selectedObject.material.color.setHex(0xFFBF00);
                }
            }
        },

        intersectClickEvent: function (event) {
            console.log("intersectClickEvent");
            // header of sonar is 70 px + metric select form 30 px
            var mouseVector = new THREE.Vector3(
                    2 * ((event.clientX - 170) / containerWidth) - 1,
                    1 - 2 * ((event.clientY - 100) / containerHeight),
                0.5);

            var raycaster = projector.pickingRay(mouseVector.clone(), camera);

            var intersects = raycaster.intersectObjects(objectsInView);

            if (intersects.length > 0) {
                return intersects[ 0 ].object;
            } else {
                return null;
            }
        }
    }
}]);