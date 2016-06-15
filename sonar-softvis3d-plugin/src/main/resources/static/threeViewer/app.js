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
'use strict';

function requireAll(r) {
    r.keys().forEach(r);
}

requireAll(require.context('./lib/', true, /\.js$/));
requireAll(require.context('./ng/', true, /\.js$/));

var appModule = angular.module('ThreeViewerApp', ['ngRoute'])
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


angular.element(document).ready(function () {
    angular.bootstrap(document, [appModule.name], {
        //strictDi: true
    });
});