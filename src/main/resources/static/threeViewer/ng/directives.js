/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
'use strict';
goog.provide('ThreeViewer.Directives');

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
ThreeViewer.SelectDirective.factory = function(ViewerService) {
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

    var x, y,
        width,
        height,
        offsetLeft,
        offsetTop,
        mouseDown = {};
    jQuery(this.elem).hammer({
        prevent_default: false
    }).bind('tap', function(e) {
        x = e.gesture.center.x;
        y = e.gesture.center.y;

        offsetLeft = this.elem.context.offsetLeft;
        offsetTop = this.elem.context.offsetTop;
        width = window.innerWidth;
        height = window.innerHeight;

        // creating NDC coordinates for ray intersection.
        mouseDown.x = (x / width) * 2 - 1;
        mouseDown.y = -(y / height) * 2 + 1;
        this.ViewerService.makeSelection(mouseDown);
    }.bind(this));
};

/**
 * @constructor
 */
ThreeViewer.FileLoaderDirective = function() {
    return {
        restrict: 'A',
        templateUrl: '/static/softVis3D/threeViewer/partials/file-loader.html'
    };
};

/**
 * @constructor
 */
ThreeViewer.ToolbarsDirective = function() {
    return {
        restrict: 'A',
        templateUrl: '/static/softVis3D/threeViewer/partials/toolbar.html'
    };
};

/**
 * @constructor
 */
ThreeViewer.AboutDirective = function() {
    return {
        restrict: 'A',
        templateUrl: '/static/softVis3D/threeViewer/partials/about.html'
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
    this.elem.on('click', function(e){
        e.stopImmediatePropagation();
        e.preventDefault();
    });
};
