var BaseModel  = require("../layout/model/base.js");
var TreeNode   = require("../layout/model/components/treenode.js");
var Version    = require("../layout/model/components/version.js");

class Softvis3dModel extends BaseModel {

    constructor(treeResult) {
        super();

        this._attributes = {};
        this._version = new Version('v1.0',  'Only one version test', 0);
        this._versions = [ this._version ];
        this._tree = new TreeNode('root');
        this._createTree(this._tree, treeResult);

        this._graph = [];
    };

    _createTree(parent, treeNode) {
        var node = parent.add(treeNode.id);

        var t = String(node);
        var v = String(this._version);
        this._attributes[String(v)] = {};
        this._attributes[v][t] = {
            'name': t,
            'loc' : treeNode.footprintMetricValue,
            'editors' : treeNode.heightMetricValue
        };

        for (var child of treeNode.children) {
            this._createTree(node, child);
        }
    }

    /**
     * Get all observed animal interactions
     * @return {object}
     */
    get graph() {
        return this._graph;
    };

    /**
     * Get the Structure of the zoo
     * @return {TreeNode}
     */
    get tree() {
        return this._tree;
    };

    /**
     * Get the observed Zoo Snapshots
     * @return {array}
     */
    get versions() {
        return this._versions;
    };

    exists(node, version) {
        return true;
    };

    /**
     * Property function
     * @param  {string} node    Node
     * @param  {string} version Version
     * @return {null|object}
     */
    attributes(node, version) {
        var n = String(node);
        var v = String(version);

        if (!this._attributes[v]
            || !this._attributes[v][n]) {
            return {};
        }

        return this._attributes[v][n];
    };
}

module.exports = Softvis3dModel;
