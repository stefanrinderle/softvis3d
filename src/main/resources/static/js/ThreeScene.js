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
var objectsInView = [];

function init(container, showStats) {
    camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
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

    setLight();
    animate();
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