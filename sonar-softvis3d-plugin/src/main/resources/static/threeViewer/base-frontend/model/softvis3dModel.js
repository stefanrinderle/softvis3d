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
var CodeCityVis = require('codecity-visualizer');

var BaseModel  = CodeCityVis.models.base;
var TreeNode   = CodeCityVis.components.node;
var Version    = CodeCityVis.components.version;

class Softvis3dModel extends BaseModel {

    constructor(treeResult) {
        super();

        this._attributes = {};
        this._version = new Version('v1.0',  'Only one version test', 0);
        this._versions = [ this._version ];
        this._tree = this._createTree(treeResult);
        this._graph = [];
    }

    _createTree(treeNode) {
        var t = String(treeNode.id);
        var v = String(this._version);

        if (!this._attributes[v]) {
            this._attributes[String(v)] = {};
        }
        
        this._attributes[v][t] = {
            'name': t,
            'loc' : treeNode.heightMetricValue,
            'editors' : treeNode.footprintMetricValue
        };

        var node = new TreeNode(t);
        for (var child of treeNode.children) {
            node.add(this._createTree(child));
        }
        
        return node;
    }

    /**
     * Get all Class/Object interactions
     * @return {object}
     */
    get graph() {
        return this._graph;
    }

    /**
     * Get the Structure of the Software
     * @return {TreeNode}
     */
    get tree() {
        return this._tree;
    }

    /**
     * Get the Software Snapshots
     * @return {Array}
     */
    get versions() {
        return this._versions;
    }

    /**
     * Does the node exist in Verion?
     * @return {boolean}
     */
    exists(node, version) {
        return true;
    }

    /**
     * Property function
     * @param  {string} node    Node
     * @param  {string} version Version
     * @return {null|object}
     */
    attributes(node, version) {
        var n = String(node);
        var v = String(version);

        if (!this._attributes[v] || !this._attributes[v][n]) {
            return null;
        }

        return this._attributes[v][n];
    }
}

module.exports = Softvis3dModel;
