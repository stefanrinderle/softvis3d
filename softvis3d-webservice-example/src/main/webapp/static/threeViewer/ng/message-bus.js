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
goog.provide('ThreeViewer.MessageBus');

/**
 * This is a messaging service.  It broadcasts from $rootScope allowing all Angular components to digest changes.
 * @param {angular.Scope} $rootScope
 *
 * @constructor
 * @export
 * @ngInject
 */
ThreeViewer.MessageBus = function ($rootScope) {
  this.message = {};
  this.rootScope = $rootScope;
};

/**
 * @export
 *
 * Trigger a message from rootScope.
 * @param {!string} type
 * @param {!string=} message
 */
ThreeViewer.MessageBus.prototype.trigger = function (type, message) {
  this.message[type] = message;
  this.broadcast(type);
};

/**
 * @export
 *
 * Get a message from rootScope.
 * @param {!string} type
 */
ThreeViewer.MessageBus.prototype.getMessage = function (type) {
  return this.message[type];
};

/**
 * Trigger a message from rootScope.
 * @param {!string} type
 */
ThreeViewer.MessageBus.prototype.broadcast = function (type) {
  this.rootScope.$broadcast(type);
};