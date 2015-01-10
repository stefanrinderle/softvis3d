/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
goog.provide('ThreeViewer.Config');

/**
 * @constructor
 * @ngInject
 */
ThreeViewer.ConfigLocalStorage = function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('ng-three-viewer');
};


/**
 * @param {angular.$locationProvider} $locationProvider
 * @constructor
 * @ngInject
 */
ThreeViewer.ConfigLocation = function ($locationProvider){
    $locationProvider.html5Mode = true;
};

/**
 * @param {angular.$routeProvider} $routeProvider
 * @constructor
 * @ngInject
 */
ThreeViewer.ConfigRouters = function ($routeProvider){
    $routeProvider.when('/', {
        templateUrl: (window.chrome) ? '/static/softVis3D/threeViewer/partials/chrome.html':'/static/softVis3D/threeViewer/partials/bad-time.html'
    }).otherwise({
        redirectTo: '/'
    });
};