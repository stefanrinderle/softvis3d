/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle
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
/**
 *
 * @param {angular.Scope} $scope
 * @param {ThreeViewer.ViewerService} ViewerService
 * @param {ThreeViewer.TreeService} TreeService
 * @constructor
 * @export
 * @ngInject
 */
ThreeViewer.ToolbarController = function ($scope, ViewerService, TreeService, MessageBus) {

  this.scope = $scope;
  this.ViewerService = ViewerService;
  this.TreeService = TreeService;
  this.MessageBus = MessageBus;

  this.node = null;
  this.displayChildren = false;

  this.metric1Name = "";
  this.metric2Name = "";
  this.scmMetricName = "";

  this.BASE_PATH = RESOURCES_BASE_PATH;

  this.init();
};

ThreeViewer.ToolbarController.prototype.init = function () {
  this.listeners();
};

ThreeViewer.ToolbarController.prototype.listeners = function () {
  var me = this;
  this.scope.$on('objectSelected', function () {
    var eventObject = me.MessageBus.getMessage('objectSelected');

    me.showDetails(eventObject.softVis3dId, eventObject.softVis3dType);
    me.scope.$apply();
  }.bind(this));

  this.scope.$on('visualizationReady', function () {
    var eventObject = me.MessageBus.getMessage('visualizationReady');

    me.metric1Name = eventObject.metric1Name;
    me.metric2Name = eventObject.metric2Name;
    me.scmMetricName = eventObject.scmMetricName;

    me.showDetails(eventObject.softVis3dId, "node");


    (function() {
      // Trigger Window-Resize
      var evt;
      try {
        evt = new UIEvent('resize');
      } catch (error) {
        // IE Fallback
        evt = document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false, window, 0);
      }

      window.dispatchEvent(evt);
    })();


  }.bind(this));

};

ThreeViewer.ToolbarController.prototype.showDetails = function (softVis3dId) {
  this.node = this.TreeService.searchTreeNode(softVis3dId);
};

ThreeViewer.ToolbarController.prototype.selectSceneObjectFromDetails = function (objectId, type) {
  this.ViewerService.selectSceneTreeObject(objectId);

  this.showDetails(objectId, type);
};

ThreeViewer.ToolbarController.prototype.showAllSceneElements = function () {
  this.ViewerService.showAllSceneElements();
};

ThreeViewer.ToolbarController.prototype.hideAllSceneElementsExceptIdTree = function (id) {
  var showIds = this.TreeService.getAllSceneElementsRecursive(id);
  this.ViewerService.hideAllSceneElementsExceptIds(showIds);
  this.ViewerService.removeObject(id, "leaf");
};

ThreeViewer.ToolbarController.prototype.triggerDisplayChildren = function () {
  if (this.displayChildren) {
    this.displayChildren = false;
  } else {
    this.displayChildren = true;
  }
};