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
goog.require('ThreeViewer.FileLoaderController');
goog.require('ThreeViewer.Directives');
goog.require('ThreeViewer.Filters');
goog.require('ThreeViewer.MessageBus');
goog.require('ThreeViewer.StorageService');
goog.require('ThreeViewer.BackendService');
goog.require('ThreeViewer.Config');
//goog.require('Viewer.Scene');

angular.module('ThreeViewerApp', ['ngHammer', 'ngRoute', 'LocalStorageModule'])
    .config(ThreeViewer.ConfigLocation)
    .config(ThreeViewer.ConfigLocalStorage)
    .config(ThreeViewer.ConfigRouters)
    .directive('select', ['ViewerService', ThreeViewer.SelectDirective.factory])
    .directive('stopEvent', ThreeViewer.StopEventDirective.factory)
    .directive('fileLoader', ThreeViewer.FileLoaderDirective)
    .directive('toolbar', ThreeViewer.ToolbarDirective)
    .directive('about', ThreeViewer.AboutDirective)
    .filter('forceInt', ThreeViewer.ForceInt.factory)
    .filter('forceFloat', ThreeViewer.ForceFloat.factory)
    .service('StorageService', ['localStorageService', 'MessageBus', ThreeViewer.StorageService])
    .service('MessageBus', ['$rootScope', ThreeViewer.MessageBus])
    .service('ViewerService', ['$timeout', 'MessageBus', ThreeViewer.ViewerService])
    .service('FileLoaderController', ['$scope', 'MessageBus', 'ViewerService', 'StorageService'])
    .service('BackendService', ['$http', ThreeViewer.BackendService])
    .controller('AppController', ['$scope', 'ViewerService', ThreeViewer.AppController])
    .controller('ToolbarController', ['$scope', 'ViewerService', ThreeViewer.ToolbarController])
    .controller('FileLoaderController', ['$scope', 'MessageBus', 'ViewerService', 'StorageService', 'BackendService', ThreeViewer.FileLoaderController]);
