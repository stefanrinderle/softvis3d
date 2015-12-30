function requireAll(r) {
    r.keys().forEach(r);
}

requireAll(require.context('./lib/', true, /\.js$/));
requireAll(require.context('./ng/', true, /\.js$/));

module.exports = angular.module('ThreeViewerApp', ['ngRoute'])
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

