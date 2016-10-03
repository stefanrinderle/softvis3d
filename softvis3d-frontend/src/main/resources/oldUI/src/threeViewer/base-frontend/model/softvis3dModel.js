/*
 * softvis3d-frontend
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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
        this._version = new Version('v1.0',  'Current', 0);
        this._versions = [ this._version ];
        this._graph = [];
        this._metricScale = {
            metricHeight: {min: Infinity, max: 0},
            metricFootprint: {min: Infinity, max: 0},
            metricColor: {min: Infinity, max: 0}
        };

        this._tree = this._createTree(treeResult);
    }

    _createTree(treeNode) {
        var t = String(treeNode.id);
        var v = String(this._version);

        if (!this._attributes[v]) {
            this._attributes[String(v)] = {};
        }
        
        this._attributes[v][t] = {
            'name': t,
            'metricHeight' : treeNode.heightMetricValue,
            'metricFootprint' : treeNode.footprintMetricValue,
            'metricColor' : treeNode.colorMetricValue
        };

        if ("heightMetricValue" in treeNode && !isNaN(parseFloat(treeNode.heightMetricValue)) && isFinite(treeNode.heightMetricValue)) {
            this._metricScale.metricHeight.min = Math.min(treeNode.heightMetricValue, this._metricScale.metricHeight.min);
            this._metricScale.metricHeight.max = Math.max(treeNode.heightMetricValue, this._metricScale.metricHeight.max);
        }

        if ("footprintMetricValue" in treeNode && !isNaN(parseFloat(treeNode.footprintMetricValue)) && isFinite(treeNode.footprintMetricValue)) {
            this._metricScale.metricFootprint.min = Math.min(treeNode.footprintMetricValue, this._metricScale.metricFootprint.min);
            this._metricScale.metricFootprint.max = Math.max(treeNode.footprintMetricValue, this._metricScale.metricFootprint.max);
        }

        if ("colorMetricValue" in treeNode && !isNaN(parseFloat(treeNode.colorMetricValue)) && isFinite(treeNode.colorMetricValue)) {
            this._metricScale.metricColor.min = Math.min(treeNode.colorMetricValue, this._metricScale.metricColor.min);
            this._metricScale.metricColor.max = Math.max(treeNode.colorMetricValue, this._metricScale.metricColor.max);
        }

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
    getGraph() {
        return this._graph;
    }

    /**
     * Get the Structure of the Software
     * @return {TreeNode}
     */
    getTree() {
        return this._tree;
    }

    /**
     * Get the Software Snapshots
     * @return {Array}
     */
    getVersions() {
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
    getAttributes(node, version) {
        var n = String(node);
        var v = String(version);

        if (!this._attributes[v] || !this._attributes[v][n]) {
            return null;
        }

        return this._attributes[v][n];
    }

    getMetricScale() {
        return this._metricScale;
    }
}

module.exports = Softvis3dModel;
