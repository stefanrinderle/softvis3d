/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2015 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
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

    for (var objectIndex = 0; objectIndex < this.resultObjects.length; objectIndex++) {
      if (objectSoftVis3dId === this.resultObjects[objectIndex].softVis3dId) {
        var selectedObjectInformation = {
          "object": this.resultObjects[objectIndex],
          "color": this.resultObjects[objectIndex].material.color.getHex()
        };
        this.selectedTreeObjects.push(selectedObjectInformation);
        this.resultObjects[objectIndex].material.color.setHex(0xFFBF00);
      }
    }
  },

  showAllSceneElements: function () {
    for (var index = 0; index < this.objectsInView.length; index++) {
      this.context.scene.remove(this.objectsInView[index]);
    }

    this.objectsInView = [];

    for (var resultObjectIndex = 0; resultObjectIndex < this.resultObjects.length; resultObjectIndex++) {
      this.objectsInView.push(this.resultObjects[resultObjectIndex]);
      this.context.scene.add(this.resultObjects[resultObjectIndex]);
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

    for (var resultObjectIndex = 0; resultObjectIndex < this.resultObjects.length; resultObjectIndex++) {
      if (this.contains(ids, this.resultObjects[resultObjectIndex].softVis3dId)) {
        var selectedObjectInformation = {
          "object": this.resultObjects[resultObjectIndex],
          "color": this.resultObjects[resultObjectIndex].material.color.getHex()
        };
        this.selectedEdgeObjects.push(selectedObjectInformation);
        this.resultObjects[resultObjectIndex].material.color.setHex(0xFF0000);
      }
    }
  },

  removeObject: function (objectSoftVis3dId, type) {
    for (var index = 0; index < this.resultObjects.length; index++) {
      if (objectSoftVis3dId === this.resultObjects[index].softVis3dId
          && type === this.resultObjects[index].softVis3dType) {
        this.context.scene.remove(this.resultObjects[index]);
      }
    }

    for (var k = 0; k < this.objectsInView.length; k++) {
      if (objectSoftVis3dId === this.objectsInView[k].softVis3dId
          && type === this.objectsInView[k].softVis3dType) {
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
