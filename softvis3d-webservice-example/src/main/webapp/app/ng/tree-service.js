/*
 * softvis3d-webservice-example
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
/**
 * Service which initiates the THREE.js scene and
 *  provides methods to interact with that scene
 *
 * @param {angular.$timeout} $timeout
 * @param {ThreeViewer.MessageBus} MessageBus
 *
 * @constructor
 * @export
 * @ngInject
 */
ThreeViewer.TreeService = function () {
  this.treeServiceTree = null;
};

ThreeViewer.TreeService.prototype.setTree = function (tree) {
  this.treeServiceTree = tree;
};

ThreeViewer.TreeService.prototype.searchTreeNode = function (id) {
  if (this.treeServiceTree != null) {
    return this.searchIdInElement(this.treeServiceTree, id);
  } else {
    console.warn("search for id " + id + " without initialized the tree.");
  }
};

ThreeViewer.TreeService.prototype.searchIdInElement = function (element, id) {
  if (element.id === id) {
    return element;
  } else if (element.children != null) {
    var result = null;
    for (var i = 0; result == null && i < element.children.length; i++) {
      result = this.searchIdInElement(element.children[i], id);
    }
    return result;
  }
  return null;
};

ThreeViewer.TreeService.prototype.searchEdge = function (id) {
  return this.searchEdgeInElement(this.treeServiceTree, id);
};

ThreeViewer.TreeService.prototype.getAllSceneElementsRecursive = function (id) {
  var node = this.searchTreeNode(id);
  var showIds = this.privateGetAllSceneElementsRecursive(node);

  return showIds;
};

ThreeViewer.TreeService.prototype.contains = function (array, obj) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === obj) {
      return true;
    }
  }
  return false;
};

ThreeViewer.TreeService.prototype.privateGetAllSceneElementsRecursive = function (node) {
  var showIds = [];
  showIds.push(node.id);

  // children nodes
  for (var i = 0; i < node.children.length; i++) {
    var result = this.privateGetAllSceneElementsRecursive(node.children[i]);
    showIds = showIds.concat(result);
  }

  return showIds;
};
