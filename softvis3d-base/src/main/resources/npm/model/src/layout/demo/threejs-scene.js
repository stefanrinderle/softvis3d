var THREE         = require("three");
var OrbitControls = require('three-orbit-controls')(THREE);

class Renderer {
    constructor(target, renderWidth = 1180, renderHeight = 650) {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, renderWidth/renderHeight, 1, 10000);
        camera.position.set( -50, -100, 550 );

        var renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.domElement.style.border = '1px solid #555';
        renderer.domElement.style.display = 'block';
        renderer.domElement.style['margin-left'] = 'auto';
        renderer.domElement.style['margin-right'] = 'auto';
        renderer.domElement.style['margin-top'] = '2px';
        renderer.domElement.style['margin-bottom'] = '2px';
        renderer.setClearColor( 0xffffff );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(renderWidth, renderHeight);
        target.appendChild(renderer.domElement);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        new OrbitControls( camera, renderer.domElement );

        var light1 = new THREE.PointLight( 0xffffff, 0.1 );
        light1.position.set( 300, 300, 300 );
        scene.add( light1 );

        var light2 = new THREE.PointLight( 0xdddddd, 0.1 );
        light2.position.set( -400, -250, 350 );
        scene.add( light2 );

        function render() {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        };
        render();

        this._scene = scene;
    };

    renderIllustration(illu) {
        this._clearShapes();
        for (var shape of illu.shapes) {
            this._addShape(shape);
        }
    };

    _clearShapes() {
        var scene = this._scene;
        for(var i = scene.children.length - 1; i >= 0; i--) {
            if (scene.children[i].type === 'PointLight') {
                continue;
            }

            scene.remove(scene.children[i]);
        }
    }

    _addShape (element) {
        var defaults = {
            position: {x: 0, y: 0, z: 0},
            dimensions: {length: 1, width: 1, height: 1},
            color: 0x000000,
            opacity: 1
        }

        for (var attr in element) {
            defaults[attr] = element[attr];
        }
        var z = defaults.position.z + Math.floor(defaults.dimensions.height / 2);

        var geometry = new THREE.BoxGeometry( defaults.dimensions.length, defaults.dimensions.width, defaults.dimensions.height, 0, 0, 0 );
        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: defaults.color,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading,
            transparent: true,
            opacity: defaults.opacity
        });

        var cube = new THREE.Mesh( geometry, material );
        cube.position.setX(defaults.position.x);  
        cube.position.setY(defaults.position.y); 

        cube.position.setZ(z); 
        this._scene.add(cube);
    };
}

module.exports = Renderer;
