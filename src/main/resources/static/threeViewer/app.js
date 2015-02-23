/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
'use strict';
goog.require('ThreeViewer.ViewerService');
goog.require('ThreeViewer.AppController');
goog.require('ThreeViewer.ToolbarController');
goog.require('ThreeViewer.FileLoaderController');
goog.require('ThreeViewer.Directives');
goog.require('ThreeViewer.Filters');
goog.require('ThreeViewer.MessageBus');
goog.require('ThreeViewer.BackendService');
goog.require('ThreeViewer.TreeService');
goog.require('ThreeViewer.Config');
goog.require('Viewer.Scene');

angular.module('ThreeViewerApp', ['ngHammer', 'ngRoute'])
    .config(ThreeViewer.ConfigLocation)
    .config(ThreeViewer.ConfigRouters)
    .directive('select', ['ViewerService', ThreeViewer.SelectDirective.factory])
    .directive('stopEvent', ThreeViewer.StopEventDirective.factory)
    .directive('fileLoader', ThreeViewer.FileLoaderDirective)
    .directive('toolbar', ThreeViewer.ToolbarDirective)
    .directive('help', ThreeViewer.HelpDirective)
    .filter('forceInt', ThreeViewer.ForceInt.factory)
    .filter('forceFloat', ThreeViewer.ForceFloat.factory)
    .filter('inDisplay', ThreeViewer.ToolbarInDisplay.factory)
    .filter('outDisplay', ThreeViewer.ToolbarOutDisplay.factory)
    .service('MessageBus', ['$rootScope', ThreeViewer.MessageBus])
    .service('ViewerService', ['$timeout', 'MessageBus', ThreeViewer.ViewerService])
    .service('BackendService', ['$http', ThreeViewer.BackendService])
    .service('TreeService', ['$http', ThreeViewer.TreeService])
    .controller('AppController', ['$scope', 'ViewerService', ThreeViewer.AppController])
    .controller('ToolbarController', ['$scope', 'ViewerService', 'TreeService', 'MessageBus', ThreeViewer.ToolbarController])
    .controller('FileLoaderController', ['$scope', 'MessageBus', 'ViewerService', 'BackendService', 'TreeService',
        ThreeViewer.FileLoaderController]);
