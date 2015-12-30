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

/**
 * @param {ThreeViewer.ViewerService} ViewerService
 *
 * @constructor
 */
ThreeViewer.SelectDirective = function (ViewerService) {
  /** @type {angular.Scope} */
  this.scope;
  /** @type {angular.JQLite} */
  this.elem;
  /** @type {angular.Attributes} */
  this.attrs;

  this.clickOrDragFlag = false;

  /**@type {ThreeViewer.ViewerService} */
  this.ViewerService = ViewerService;

  this.link = this.link.bind(this);
};

/**
 * @return {Object}
 *
 * @param {ThreeViewer.ViewerService} ViewerService
 *
 * @ngInject
 */
ThreeViewer.SelectDirective.factory = function (ViewerService) {
  var d = new ThreeViewer.SelectDirective(ViewerService);
  return {
    'restrict': 'A',
    link: d.link
  };
};

/**
 * Linking function.
 * @ngInject
 */
ThreeViewer.SelectDirective.prototype.link = function (scope, elem, attrs) {
  this.scope = scope;
  this.elem = elem;
  this.attrs = attrs;
  this.clickOrDragFlag = false;

  var me = this;
  this.elem.on('mousedown', function (e) {
    me.clickOrDragFlag = false;
  });

  this.elem.on('mousemove', function (e) {
    me.clickOrDragFlag = true;
  });

  this.elem.on('mouseup', function (event) {
    if(me.clickOrDragFlag){
      // drag
      me.clickOrDragFlag = false;
    } else {
      me.ViewerService.makeSelection(event);
    }
  });
};

/**
 * @constructor
 */
ThreeViewer.FileLoaderDirective = function () {
  return {
    restrict: 'A',
    templateUrl: RESOURCES_BASE_PATH + '/partials/file-loader.html'
  };
};

/**
 * @constructor
 */
ThreeViewer.ToolbarDirective = function () {
  return {
    restrict: 'A',
    templateUrl: RESOURCES_BASE_PATH + '/partials/toolbar.html'
  };
};

/**
 * @constructor
 */
ThreeViewer.HelpDirective = function () {
  return {
    restrict: 'A',
    templateUrl: RESOURCES_BASE_PATH + '/partials/help.html'
  };
};

/**
 * @constructor
 */
ThreeViewer.StopEventDirective = function () {
  /** @type {angular.Scope} */
  this.scope;
  /** @type {angular.JQLite} */
  this.elem;
  /** @type {angular.Attributes} */
  this.attrs;

  this.link = this.link.bind(this);
};

ThreeViewer.StopEventDirective.factory = function () {
  var d = new ThreeViewer.StopEventDirective();

  return {
    restrict: 'A',
    link: d.link
  };
};
/**
 * Linking function
 * @param {angular.Scope} scope
 * @param {angular.JQLite} elem
 * @param {angular.Attributes} attrs
 */
ThreeViewer.StopEventDirective.prototype.link = function (scope, elem, attrs) {
  this.scope = scope;
  this.elem = elem;
  this.attrs = attrs;
  this.elem.on('click', function (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
  });
};
