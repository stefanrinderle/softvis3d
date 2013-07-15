var controls;

var ThreeScene = function(container) {
	
	this.container = container;
	
	this.scene = new THREE.Scene(); 
	
	this.camera = new THREE.PerspectiveCamera(60, window.innerWidth
			/ window.innerHeight, 1, 10000);
	
	this.renderer = new THREE.WebGLRenderer({
		antialias : true
	});
	
	var stats = new Stats();
	
	this.init = function() {
		this.startRenderer();
		this.setLight();
		
		this.createCenterCube();
		
		window.addEventListener('resize', this.onWindowResize, false);
		this.onWindowResize();
		
		animate();
		
		this.render();
		
		this.camera.position.set(0, 4000, 4000);
	},
	
	this.startRenderer = function () {
		this.camera.position.set(0, 0, 0);

		this.renderer.setClearColor(0xffffff, 1);
		
		controls = new THREE.OrbitControls(this.camera, this.container);
		
		var cameraRef = this.camera;
		var sceneRef = this.scene;
		var rendererRef = this.renderer;
		controls.addEventListener('change', function render() {
			rendererRef.render(sceneRef, cameraRef);
			stats.update();
		});
		
		this.container.appendChild(this.renderer.domElement);
		
		// TODO SRI: stats should be its own container, not blocking the rest of the rendering view
		/**this.showStats(this.container);**/
	},
	
	this.setLight = function () {
		var light = new THREE.DirectionalLight( 0xaaaaaa);
	    light.position.set( 1, 0, 0 ).normalize();
	    this.scene.add( light );

	    var light = new THREE.DirectionalLight( 0xcccccc);
	    light.position.set( -1, 0, 0 ).normalize();
	    this.scene.add( light );
	    
	    var light = new THREE.DirectionalLight( 0xddddddd);
	    light.position.set( 0, 0, 1 ).normalize();
	    this.scene.add( light );
	    
	    var light = new THREE.DirectionalLight( 0xeeeeee);
	    light.position.set( 0, 0, -1 ).normalize();
	    this.scene.add( light );
	    
	    var directionalLight = new THREE.DirectionalLight( 0xffffff);
	    directionalLight.position.set( 0, 1, 0 );
	    this.scene.add( directionalLight );
	},
	
	this.showStats = function() {
		// show stats
		stats.domElement.style.zIndex = 100;
		this.container.appendChild(stats.domElement);
	},
	
	this.createCenterCube = function() {
		// create center cube for better navigation
		var centerCube = new THREE.CubeGeometry(10, 10, 10);
		var greenMaterial = new THREE.MeshBasicMaterial({
			color : 0x00ff00
		});
		position = new Array();
		position.x = 0;
		position.y = 0;
		position.z = 0;

		var mesh = new THREE.Mesh(centerCube, greenMaterial);
		mesh.position.x = position.x;
		mesh.position.y = position.y;
		mesh.position.z = position.z;
		mesh.updateMatrix();
		mesh.matrixAutoUpdate = false;

		this.scene.add(mesh);
	},

	this.onWindowResize = function() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		// header of sonar is 70 px + footer 50 px + metric select form 30 px 
		// sidebar 200px
		this.renderer.setSize(window.innerWidth - 200, window.innerHeight - 150);

		this.render();
	},

	this.render = function() {
		this.renderer.render(this.scene, this.camera);
		stats.update();
	},
	
	this.createBox = function(geometry1, material1, position1) {
		var mesh1 = new THREE.Mesh(geometry1, material1);
		mesh1.position.x = position1.x;
		mesh1.position.y = position1.y;
		mesh1.position.z = position1.z;
		mesh1.updateMatrix();
		mesh1.matrixAutoUpdate = false;

		this.scene.add(mesh1);
	},

	this.drawText = function(textbla, position2, size) {
        // ///// draw text on canvas /////////

        // create a canvas element
        var canvas1 = document.createElement('canvas');
        var context1 = canvas1.getContext('2d');
        
        context1.font = "Bold " + size + "px Arial";
        // context1.fillStyle = "rgba(255,0,0,0.95)";
        context1.fillText(textbla, 0, size);

        var value = context1.measureText(textbla).width;
        canvas1.width = value;
        canvas1.height = size;
        
        context1.font = size + "px Arial";
        context1.textBaseline = "bottom";
        context1.fillStyle = "rgba(0,0,0,0.95)";
        context1.fillText(textbla, 0, size);
        
        
        // canvas contents will be used for a texture
        var texture1 = new THREE.Texture(canvas1);
        texture1.needsUpdate = true;
          
        var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
        material1.transparent = true;

        var mesh1 = new THREE.Mesh(
            new THREE.PlaneGeometry(canvas1.width, canvas1.height),
            material1
          );
        mesh1.position = position2;
        this.scene.add( mesh1 );
    };
};

function animate() {
	requestAnimationFrame(animate);
	controls.update();
}