/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
'use strict';
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
 * Trigger a message from rootScope.
 * @param {!string} type
 */
ThreeViewer.MessageBus.prototype.broadcast = function (type) {
    this.rootScope.$broadcast(type);
};