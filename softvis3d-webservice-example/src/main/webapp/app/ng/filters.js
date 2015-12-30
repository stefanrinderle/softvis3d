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
    return "From parent layer";
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
    return "To parent layer";
  } else {
    return input;
  }
};