/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
var camera, scene, projector, renderer;

var controls;
//var objects = [];
var objectsInView = [];

var containerWidth, containerHeight;

var selectedObject, selectedObjectColor;

var clickOrDragFlag = 0;

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
        var stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.bottom = '0px';
        container.appendChild(stats.domElement);

        controls.addEventListener('change', function renderStats() {
            stats.update();
        });
    }

    initMouseEvents();

    window.addEventListener('resize', onWindowResize, false);

    onWindowResize();

    setLight();
    animate();
}

function onWindowResize() {
    containerWidth = window.innerWidth - 380;
    containerHeight = window.innerHeight - 170;

    renderer.setSize(containerWidth, containerHeight);
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();

    document.getElementById("detailsContainer").style.height = containerHeight + "px";
}

function initMouseEvents() {
    document.getElementById("detailsContainer").addEventListener('mousedown', function (e) {
        e.stopPropagation();
    }, false);

    document.addEventListener("mousedown", function(){
        clickOrDragFlag = 0;
    }, false);
    document.addEventListener("mousemove", function(){
        clickOrDragFlag = 1;
    }, false);

    document.addEventListener('mouseup', onDocumentMouseUp, false);
}

function onDocumentMouseUp(event) {
    if(clickOrDragFlag === 1){
        clickOrDragFlag = 0;
    } else if(clickOrDragFlag === 0){
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

            angular.element(document.getElementById('detailsContainer')).scope().showDetails(intersects[ 0 ].object.softVis3DId);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
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