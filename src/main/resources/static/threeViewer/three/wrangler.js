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
    this.selectedEdgeObjects = [];

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

    loadSoftVis3d: function (data) {
        this.removeAllFromScene();

        this.resultObjects = this.context.objectFactory.createObjects(data);

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

    showAllSceneElements: function () {
        for (var index = 0; index < this.objectsInView.length; index++) {
            this.context.scene.remove(this.objectsInView[index]);
        }

        this.objectsInView = [];

        for (var index = 0; index < this.resultObjects.length; index++) {
            this.objectsInView.push(this.resultObjects[index]);
            this.context.scene.add(this.resultObjects[index]);
        }
    },

    hideAllSceneElementsExceptIds: function (showIds) {
        this.hideAllSceneElements();

        for (var index = 0; index < this.resultObjects.length; index++) {
            if (this.contains(showIds, this.resultObjects[index].softVis3dId)) {
                this.objectsInView.push(this.resultObjects[index]);
                this.context.scene.add(this.resultObjects[index]);
            }
        }
    },

    hideAllSceneElements: function () {
        for (var index = 0; index < this.objectsInView.length; index++) {
            this.context.scene.remove(this.objectsInView[index]);
        }

        this.objectsInView = [];
    },

    selectSceneEdgeObjects: function (ids) {
        // reset former selected objects
        for (var index = 0; index < this.selectedEdgeObjects.length; index++) {
            this.selectedEdgeObjects[index].object.material.color.setHex(this.selectedEdgeObjects[index].color);
        }

        this.selectedEdgeObjects = [];

        for (var index = 0; index < this.resultObjects.length; index++) {
            if (this.contains(ids, this.resultObjects[index].softVis3dId)) {
                var selectedObjectInformation = {
                    "object": this.resultObjects[index],
                    "color": this.resultObjects[index].material.color.getHex()
                };
                this.selectedEdgeObjects.push(selectedObjectInformation);
                this.resultObjects[index].material.color.setHex(0xFF0000);
            }
        }
    },

    removeObject: function (objectSoftVis3dId, type) {
        for (var index = 0; index < this.resultObjects.length; index++) {
            if (objectSoftVis3dId == this.resultObjects[index].softVis3dId
                && type == this.resultObjects[index].softVis3dType) {
                this.context.scene.remove(this.resultObjects[index]);
            }
        }

        for (var k = 0; k < this.objectsInView.length; k++) {
            if (objectSoftVis3dId == this.objectsInView[k].softVis3dId
                && type == this.objectsInView[k].softVis3dType) {
                this.objectsInView.splice(k, 1);
            }
        }
    },

    contains: function (a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    },

    /**
     * Removes the old object from the scene
     */
    removeAllFromScene: function () {
        for (var index = 0; index < this.objectsInView.length; index++) {
            var object = this.objectsInView[index];
            this.context.scene.remove(object);
        }
    }
};
