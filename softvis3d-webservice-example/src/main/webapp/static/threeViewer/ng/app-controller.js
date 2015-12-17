/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
goog.provide('ThreeViewer.AppController');

/**
 *
 * @param {angular.Scope} $scope
 * @param {ThreeViewer.ViewerService} ViewerService
 *
 * @constructor
 * @export
 * @ngInject
 */
ThreeViewer.AppController = function ($scope, ViewerService) {

  this.scope = $scope;
  this.ViewerService = ViewerService;

  /**
   * @expose
   * @type {{help: boolean, toolbar: boolean, loader: boolean}}
   */
  this.tb = {
    'help': false,
    'toolbar': false,
    'loader': true
  };

  this.init();
};

ThreeViewer.AppController.prototype.init = function () {
  if (!Detector.webgl) {
    console.error("No webgl support detected.");
  } else {
    this.ViewerService.init({
      canvasId: 'viewer',
      containerId: 'infoContainer'
    });
    this.listeners();
  }

};

ThreeViewer.AppController.prototype.listeners = function () {
  var me = this;
  this.scope.$on('hideLoader', function () {
    me.tb.loader = false;
    me.tb.toolbar = true;
  }.bind(this));
};

/**
 * @export
 */
ThreeViewer.AppController.prototype.toggleLoader = function () {
  this.tb.help = false;
  this.tb.loader = !this.tb.loader;
};

/**
 * @export
 */
ThreeViewer.AppController.prototype.toggleHelp = function () {
  this.tb.loader = false;
  this.tb.help = !this.tb.help;
};

/**
 * @export
 */
ThreeViewer.AppController.prototype.toggleToolbar = function () {
  this.tb.toolbar = !this.tb.toolbar;
};