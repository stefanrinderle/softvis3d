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
/* tslint:disable */
import * as CodeCityVis from "codecity-visualizer";
import {MetricScale} from "./LayoutProcessor";
import {TreeElement} from "../../classes/TreeElement";

const BaseModel  = CodeCityVis.models.base;
const TreeNode   = CodeCityVis.components.node;
const Version    = CodeCityVis.components.version;

type TreeNodeInterface = CodeCityVis.components.node;
type VersionInterface = CodeCityVis.components.version;

export default class Softvis3dModel extends BaseModel {
    public _version: VersionInterface;
    private _versions: VersionInterface[];
    private _attributes: any;
    private _graph: any[];
    private _tree: TreeNodeInterface;
    private _metricScale: MetricScale;
    private _footprintKey :string;
    private _heightKey :string;
    private _metricColorKey :string;

    constructor(treeResult: TreeElement, footprintKey: string, heightKey: string, metricColorKey: string) {
        super();

        this._attributes = {};
        this._version = new Version('v1.0',  'Current', 0);
        this._versions = [ this._version ];
        this._graph = [];
        this._metricScale = {
            height: {min: Infinity, max: 0},
            metricFootprint: {min: Infinity, max: 0},
            metricColor: {min: Infinity, max: 0}
        };

        this._footprintKey = footprintKey;
        this._heightKey = heightKey;
        this._metricColorKey = metricColorKey;

        this._tree = this._createTree(treeResult);
    }

    private _createTree(treeNode: TreeElement) {
        const t = String(treeNode.id);
        const v = String(this._version);

        if (!this._attributes[v]) {
            this._attributes[String(v)] = {};
        }

        this._attributes[v][t] = {
            'name': t,
            'height' : this.getMetricValue(treeNode, this._heightKey),
            'metricFootprint' : this.getMetricValue(treeNode, this._footprintKey),
            'metricColor' : this.getMetricValue(treeNode, this._metricColorKey)
        };


        if (this.isMetricValueSet(treeNode, this._heightKey) && treeNode.isFile) {
            this._metricScale.height.min = Math.min(treeNode.measures[this._heightKey], this._metricScale.height.min);
            this._metricScale.height.max = Math.max(treeNode.measures[this._heightKey], this._metricScale.height.max);
        }

        if (this.isMetricValueSet(treeNode, this._footprintKey) && treeNode.isFile) {
            this._metricScale.metricFootprint.min = Math.min(treeNode.measures[this._footprintKey], this._metricScale.metricFootprint.min);
            this._metricScale.metricFootprint.max = Math.max(treeNode.measures[this._footprintKey], this._metricScale.metricFootprint.max);
        }

        if (this.isMetricValueSet(treeNode, this._metricColorKey) && treeNode.isFile) {
            this._metricScale.metricColor.min = Math.min(treeNode.measures[this._metricColorKey], this._metricScale.metricColor.min);
            this._metricScale.metricColor.max = Math.max(treeNode.measures[this._metricColorKey], this._metricScale.metricColor.max);
        }

        const node = new TreeNode(t);
        for (const child of treeNode.children) {
            node.add(this._createTree(child));
        }

        return node;
    }

    getMetricValue(treeNode: TreeElement, key: string): number {
        return this.isMetricValueSet(treeNode, key) ? treeNode.measures[key] as number : 0;
    }

    isMetricValueSet(treeNode: TreeElement, key: string): boolean {
        return treeNode.measures !== undefined
            && key in treeNode.measures
            && !isNaN(treeNode.measures[key])
            && isFinite(treeNode.measures[key]);
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
     * Does the node exist in Version?
     * @return {boolean}
     */
    exists() {
        return true;
    }

    /**
     * Property function
     * @param  {string} node    Node
     * @param  {string} version Version
     * @return {null|object}
     */
    getAttributes(node: TreeNodeInterface, version: VersionInterface) {
        const n = String(node);
        const v = String(version);

        if (!this._attributes[v] || !this._attributes[v][n]) {
            return null;
        }

        return this._attributes[v][n];
    }

    getMetricScale(): MetricScale {
        return this._metricScale;
    }
}
