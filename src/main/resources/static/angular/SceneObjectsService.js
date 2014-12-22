/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
softVis3dAngular.factory('sceneObjectsService',
    ['$rootScope', '$window', function ($rootScope, $window) {
        var sceneObjectsServiceObjects = [];
        var objectsInView = [];

        var selectedObject = null;
        var selectedObjectColor = null;

        var containerWidthLocal;
        var containerHeightLocal;

        var scene = null;
        var camera = null;
        var projector = null;
        var renderer = null;

        var service = {

            initScene: function () {
                camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
                camera.position.set(0, 300, 500);

                scene = new THREE.Scene();

                projector = new THREE.Projector();

                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true
                });

                var container = document.getElementById('renderContainer');
                container.appendChild(renderer.domElement);

                var controls = new THREE.OrbitControls(camera, container);
                controls.keyPanSpeed = 30.0;

                this.setLight();
                this.animate();

                var w = angular.element($window);
                service.windowResize(null, w.width(), w.height());
            },

            push: function (object) {
                sceneObjectsServiceObjects.push(object);
                objectsInView.push(object);
                scene.add(object);
            },

            windowResize: function (event, width, height) {
                // header of sonar is 70 px + metric select form 30 px + footer 50 px
                // sidebar 200px
                containerWidthLocal = width - 380;
                containerHeightLocal = height - 170;

                if (renderer != null && camera != null) {
                    renderer.setSize(containerWidthLocal, containerHeightLocal);
                    camera.aspect = containerWidthLocal / containerHeightLocal;
                    camera.updateProjectionMatrix();
                }

                document.getElementById("detailsContainer").style.height = containerHeightLocal + "px";
            },

            selectSceneObjectByType: function (id, type) {
                for (var index = 0; index < sceneObjectsServiceObjects.length; index++) {
                    if (id == sceneObjectsServiceObjects[index].softVis3DId &&
                        type == sceneObjectsServiceObjects[index].type) {
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
                // header of sonar is 70 px + metric select form 30 px
                var mouseVector = new THREE.Vector3(
                        2 * ((event.clientX - 170) / containerWidthLocal) - 1,
                        1 - 2 * ((event.clientY - 100) / containerHeightLocal),
                    0.5);

                var raycaster = projector.pickingRay(mouseVector.clone(), camera);
                var intersects = raycaster.intersectObjects(objectsInView);

                if (intersects.length > 0) {
                    var intersectedObject = intersects[ 0 ].object;
                    this.selectSceneObjectByType(intersectedObject.softVis3DId, intersectedObject.type);
                    return intersectedObject;
                } else {
                    return null;
                }
            },

            animate: function () {
                requestAnimationFrame(service.animate);
                renderer.render(scene, camera);
            },

            setLight: function () {
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
            }
        }

        // listen on window resize event
        $rootScope.$on("windowResize", service.windowResize);

        return service;
    }]);