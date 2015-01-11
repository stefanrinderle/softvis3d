/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
goog.provide('Viewer.Wrangler');
/**
 * @class This is a resource manager and loads individual models.
 *
 * @struct
 * @constructor
 */
Viewer.Wrangler = function (params) {

    this.context = params.context;

    this.currentModel = null;

    this.resultObjects = [];
    this.objectsInView = [];

    this.loadingManager = new THREE.LoadingManager();
    //used
    this.objMtlLoader = new THREE.OBJMTLLoader(this.loadingManager);
    this.objLoader = new THREE.OBJLoader(this.loadingManager);
    this.imgLoader = new THREE.ImageLoader(this.loadingManager);
    this.glTFLoader = new THREE.glTFLoader();
    this.jsLoader = new THREE.JSONLoader();

    this.name = null;

    this.imgFiles = {};
};

/**
 *
 */
Viewer.Wrangler.prototype = {

    init: function () {
        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
        this.listeners();
    },

    listeners: function () {
        this.loadingManager.onProgress = function (item, loaded, total) {
            console.log(item, loaded, total);
        };
    },

    loadSoftVis3d: function(data) {
        this.removeAllFromScene();

        this.resultObjects = this.context.objectBuilder.createObjects(data);

        for (var index = 0; index < this.resultObjects.length; index++) {
            var object = this.resultObjects[index];
            this.objectsInView.push(object);
            this.context.scene.add(object);
        }
    },

    /**
     * Removes the old object from the scene
     */
    removeAllFromScene: function(){
        for (var index = 0; index < this.objectsInView.length; index++) {
            var object = this.objectsInView[index];
            this.context.scene.remove(object);
        }
    }
};
