var stats;
var camera, scene, projector, renderer;

var controls;
var objects = [];

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
    }
}

function showDetails(snapshotId) {
    callAjax("../../api/softViz3d/getSnapshotDetails?snapshotId=" + snapshotId, function(response) {
        var node = JSON.parse(response);
        var result = "Id: " + node.id + "<br />";
        result += "Name: " + node.name + "<br />";
        result += "Depth: " + node.depth + "<br />";
        result += "FootprintMetric: " + node.footprintMetricValue + "<br />";
        result += "HeightMetric: " + node.heightMetricValue;
        document.getElementById('detailsContainer').innerHTML = result;
    });
}

function initializeWebservice(snapshotId, footprintMetricId, heightMetricId) {
    callAjax("../../api/softViz3d/initialize?snapshotId=" + snapshotId
            + "&footprintMetricId=" + footprintMetricId + "&heightMetricId=" + heightMetricId,
        function(response) {
            console.log(response)
        });
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

function createCenterCube() {
    var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.5 } );
    var geometry = new THREE.BoxGeometry( 10, 10, 10 );

    var position = new Array();
    position.x = 0;
    position.y = 0;
    position.z = 0;

    createBox(geometry, cubeMaterial, position, 0);

    var dir = new THREE.Vector3( 100, 0, 0 );
    var origin = new THREE.Vector3( 0, 0, 0 );
    var length = 10;
    var hex = 0xff0000;

    var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
    scene.add( arrowHelper );
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

function drawCylinder( pointX, pointY) {
    /* edge from X to Y */
    var direction = new THREE.Vector3().subVectors( pointY, pointX );
    var orientation = new THREE.Matrix4();
    /* THREE.Object3D().up (=Y) default orientation for all objects */
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    /* rotation around axis X by -90 degrees
     * matches the default orientation Y
     * with the orientation of looking Z */
    orientation.multiply(new THREE.Matrix4(1,0,0,0,
        0,0,1,0,
        0,-1,0,0,
        0,0,0,1));

    /* cylinder: radiusAtTop, radiusAtBottom,
     height, radiusSegments, heightSegments */
    var radius = 4;
    var edgeGeometry = new THREE.CylinderGeometry( radius, radius, direction.length(), 8, 1);
    var edge = new THREE.Mesh( edgeGeometry,
        new THREE.MeshBasicMaterial( { color: 0x0000ff } ) );

    edge.applyMatrix(orientation);
    direction = direction.multiplyScalar(0.5);

    edge.applyMatrix( new THREE.Matrix4().makeTranslation(
            pointX.x + direction.x, pointX.y + direction.y, pointX.z + direction.z));

    scene.add(edge);
}
