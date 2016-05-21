var BaseModel  = require("./layout/model/base.js");
var TreeNode   = require("./layout/model/components/treenode.js");
var Version    = require("./layout/model/components/version.js");
var Illustrator = require("./layout/illustrator/evostreet.js");

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

    getIllustration() {
      /* Step 2: Generate a CodeCity from Model
       * - Configure Illustrator Layout (Options)
       * - Decide on Metrics to use (Rules)
       * - Draw a specific Version of the City
       */
      var options = {
        'highway.color': 0x186f9a,
        'street.color': 0x156289,
        'house.margin': 2,
        'evostreet.options': {
          'spacer.initial': 20,
          'spacer.conclusive': 0,
          'spacer.branches': 20,
          'house.container': require("./layout/illustrator/container/lightmap.js"),
          'house.distribution': 'left',
          'house.segmentation': 'versions.first'
        }
      };

      var illustrator = new Illustrator(this, options);

      illustrator.addRule(require('./layout/illustrator/rules/loc-to-height.js')());
      illustrator.addRule(require('./layout/illustrator/rules/editor-to-width.js')());
      illustrator.addRule(require('./layout/illustrator/rules/package-to-color.js')());
      illustrator.addRule(require('./layout/illustrator/rules/save-first-version.js')());
      illustrator.addRule(require('./layout/illustrator/rules/opacity-if-not-in-version.js')());

      var versionToDraw = this._versions[0];
      return illustrator.draw(versionToDraw);
    }

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
