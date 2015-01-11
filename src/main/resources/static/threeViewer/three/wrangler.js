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

    this.selectedTreeObjects = [];

    this.name = null;
};

/**
 *
 */
Viewer.Wrangler.prototype = {

    init: function () {
        this.listeners();
    },

    listeners: function () {
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

    selectSceneTreeObject: function (objectSoftVis3dId) {
        // reset former selected objects
        for (var index = 0; index < this.selectedTreeObjects.length; index++) {
            this.selectedTreeObjects[index].object.material.color.setHex(this.selectedTreeObjects[index].color);
        }

        this.selectedTreeObjects = [];

        for (var index = 0; index < this.resultObjects.length; index++) {
            if (objectSoftVis3dId === this.resultObjects[index].softVis3dId) {
                var selectedObjectInformation = {
                    "object": this.resultObjects[index],
                    "color": this.resultObjects[index].material.color.getHex()
                };
                this.selectedTreeObjects.push(selectedObjectInformation);
                this.resultObjects[index].material.color.setHex(0xFFBF00);
            }
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
