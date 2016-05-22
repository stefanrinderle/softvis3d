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
        this._tree = new TreeNode('root');
        this._createTree(this._tree, treeResult);

        this._graph = [];
    };

    _createTree(parent, treeNode) {
        var t = String(treeNode.id);
        var v = String(this._version);
        var node = parent.add(t);

        if (!this._attributes[v]) {
            this._attributes[String(v)] = {};
        }
        
        this._attributes[v][t] = {
            'name': t,
            'loc' : treeNode.heightMetricValue,
            'editors' : treeNode.footprintMetricValue
        };

        for (var child of treeNode.children) {
            this._createTree(node, child);
        }
    }

    /**
     * Get all Class/Object interactions
     * @return {object}
     */
    get graph() {
        return this._graph;
    };

    /**
     * Get the Structure of the Software
     * @return {TreeNode}
     */
    get tree() {
        return this._tree;
    };

    /**
     * Get the Software Snapshots
     * @return {array}
     */
    get versions() {
        return this._versions;
    };

    /**
     * Does the node exist in Verion?
     * @return {boolean}
     */
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

        if (!this._attributes[v] || !this._attributes[v][n]) {
            return null;
        }

        return this._attributes[v][n];
    };
}

module.exports = Softvis3dModel;
