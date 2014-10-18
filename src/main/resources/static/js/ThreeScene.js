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
    containerHeight = window.innerHeight - 150;
    containerWidth = window.innerWidth - 200;

    camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 10000 );
    camera.position.set( 0, 300, 500 );

    scene = new THREE.Scene();

    projector = new THREE.Projector();

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    container.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls(camera, container);

    if (showStats) {
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.bottom = '0px';
        container.appendChild( stats.domElement );

        controls.addEventListener('change', function render() {
            stats.update();
        });
    }

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

    window.addEventListener( 'resize', onWindowResize, false );

    onWindowResize();
}

function onWindowResize() {
    containerWidth = window.innerWidth - 200;
    containerHeight = window.innerHeight - 150;

    renderer.setSize( containerWidth, containerHeight );
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
}

function onDocumentMouseDown( event ) {

    //event.preventDefault();

    // header of sonar is 70 px + metric select form 30 px
    var mouseVector = new THREE.Vector3(
            2 * ((event.clientX - 170) / containerWidth) - 1,
            1 - 2 * ((event.clientY - 100) / containerHeight),
        0.5 );

//    var mouseVector = new THREE.Vector3(
//            2 * ((event.clientX) / containerWidth) - 1,
//            1 - 2 * ((event.clientY) / containerHeight),
//        0.5 );

    var raycaster = projector.pickingRay( mouseVector.clone(), camera );

    var intersects = raycaster.intersectObjects( objectsInView );

    if ( intersects.length > 0 ) {

        // reset former selected object
        if (!!selectedObject) {
            selectedObject.material.color.setHex(selectedObjectColor);
        }

        selectedObject = intersects[ 0 ].object;
        selectedObjectColor = selectedObject.material.color.getHex();
        selectedObject.material.color.setHex(0xFFBF00);

        showDetails(intersects[ 0 ].object.softviz3dId, intersects[ 0 ].object.type);
    }
}

function callAjax(url, callback){
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function animate() {
    requestAnimationFrame(animate);

    render();
}

function render() {
    renderer.render( scene, camera );
}

function createBox(geometry, material, position, id, type) {
    var object = new THREE.Mesh( geometry,  material);

    object.position.x = position.x;
    object.position.y = position.y;
    object.position.z = position.z;

    object.softviz3dId = id;
    object.type = type;

    objects.push( object );
    objectsInView.push( object );

    scene.add(object);
};

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
