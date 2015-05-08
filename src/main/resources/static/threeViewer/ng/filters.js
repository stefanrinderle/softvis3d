/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
'use strict';
goog.provide('ThreeViewer.Filters');

/**
 * @constructor
 */
ThreeViewer.ForceInt = function () {
    this.force = this.force.bind(this);
};

/**
 * @return {function}
 */
ThreeViewer.ForceInt.factory = function () {
    var filter = new ThreeViewer.ForceInt();
    return filter.force;
};

/**
 * @param {!string} input
 * @return {Number}
 */
ThreeViewer.ForceInt.prototype.force = function (input) {
    return parseInt(input, 10);
};

/**
 * @constructor
 */
ThreeViewer.ForceFloat = function () {
    this.force = this.force.bind(this);
};

/**
 * @return {function}
 */
ThreeViewer.ForceFloat.factory = function () {
    var filter = new ThreeViewer.ForceFloat();
    return filter.force;
};

/**
 * @param {!string} input
 * @return {Number}
 */
ThreeViewer.ForceFloat.prototype.force = function (input) {
    return parseFloat(input);
};


/**
 * @constructor
 */
ThreeViewer.ToolbarInDisplay = function () {
    this.force = this.force.bind(this);
};

/**
 * @return {function}
 */
ThreeViewer.ToolbarInDisplay.factory = function () {
    var filter = new ThreeViewer.ToolbarInDisplay();
    return filter.force;
};

/**
 * @param {String} input
 * @return {String}
 */
ThreeViewer.ToolbarInDisplay.prototype.force = function (input) {
    if (input.indexOf("elevatorNode_") > -1) {
        return "From parent layer"
    } else {
        return input;
    }
};

/**
 * @constructor
 */
ThreeViewer.ToolbarOutDisplay = function () {
    this.force = this.force.bind(this);
};

/**
 * @return {function}
 */
ThreeViewer.ToolbarOutDisplay.factory = function () {
    var filter = new ThreeViewer.ToolbarOutDisplay();
    return filter.force;
};

/**
 * @param {String} input
 * @return {String}
 */
ThreeViewer.ToolbarOutDisplay.prototype.force = function (input) {
    if (input.indexOf("elevatorNode_") > -1) {
        return "To parent layer"
    } else {
        return input;
    }
};