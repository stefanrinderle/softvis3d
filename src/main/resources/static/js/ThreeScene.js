var container, stats;
var camera, scene, projector, renderer;

var controls;
var objects = [];

var containerWidth, containerHeight;

var selectedObject, selectedObjectColor;

function init(container, showStats) {
    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.bottom = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    container.appendChild( info );

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

    controls = new THREE.OrbitControls(camera, this.container);

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

    event.preventDefault();

    // header of sonar is 70 px + metric select form 30 px
    var mouseVector = new THREE.Vector3(
            2 * ((event.clientX - 170) / containerWidth) - 1,
            1 - 2 * ((event.clientY - 100) / containerHeight),
        0.5 );

    var raycaster = projector.pickingRay( mouseVector.clone(), camera );

    var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {

        // reset former selected object
        if (!!selectedObject) {
            selectedObject.material.color.setHex(selectedObjectColor);
        }

        selectedObject = intersects[ 0 ].object;
        selectedObjectColor = selectedObject.material.color.getHex();
        selectedObject.material.color.setHex(0xFFBF00);

        showDetails(intersects[ 0 ].object.softviz3dId);
        console.log(intersects[ 0 ].object.softviz3dId);
    }
}

function showDetails(snapshotId) {

}

function animate() {
    requestAnimationFrame(animate);

    render();
}

function render() {
    renderer.render( scene, camera );
}

function createCenterCube() {
    var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.5 } );
    var geometry = new THREE.BoxGeometry( 100, 100, 100 );

    var position = new Array();
    position.x = 0;
    position.y = 0;
    position.z = 0;

    createBox(geometry, cubeMaterial, position, 0);
};

function createBox(geometry, material, position, id) {
    var object = new THREE.Mesh( geometry,  material);

    object.position.x = position.x;
    object.position.y = position.y;
    object.position.z = position.z;

    object.softviz3dId = id;

    objects.push( object );

    scene.add(object)
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