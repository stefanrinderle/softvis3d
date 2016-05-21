var BaseModel  = require("./base.js");
var TreeNode   = require("./components/treenode.js");
var Version    = require("./components/version.js");
var Dependency = require("./components/dependency.js");

/**
 * ZooModel returning animals
 *
 * @implements BaseSoftwareModel
 */
class ZooModel extends BaseModel {
    constructor() {
        super();
        
        /* Step 1: Create Tree */
        var tree = new TreeNode('zoo');
        tree.add('mammals');
        tree.find('mammals').add('armadillo');
        tree.find('mammals').add('bentaltiger');
        tree.find('mammals').add('zebra');
        tree.find('mammals').add('elephant');
        tree.find('mammals').add('hyena');
        tree.find('mammals').add('monkeys');
        tree.find('monkeys').add('callitrichidae');
        tree.find('callitrichidae').add('marmoset');
        tree.find('callitrichidae').add('tamarin');
        tree.find('monkeys').add('cebidae ');
        tree.find('cebidae ').add('squirrelmonkey');
        tree.find('cebidae ').add('capuchin');
        tree.find('monkeys').add('chimp');
        tree.find('monkeys').add('macaque');
        tree.find('monkeys').add('orangutan');
        tree.find('monkeys').add('gorilla');
        tree.find('monkeys').add('langur');
        tree.find('monkeys').add('baboon');
        tree.find('monkeys').add('douc');
        tree.find('mammals').add('cats');
        tree.find('cats').add('lynx');
        tree.find('cats').add('silvestris');
        tree.find('cats').add('cafra');
        tree.find('cats').add('caucasica');
        tree.find('cats').add('caudata');
        tree.find('cats').add('chutuchta');
        tree.find('cats').add('cretensis');
        tree.find('cats').add('gordoni');
        tree.find('cats').add('grampia');
        tree.find('cats').add('griselda');
        tree.find('cats').add('hausa');
        tree.find('cats').add('jordansi');
        tree.find('cats').add('lybica');
        tree.find('cats').add('nesterovi');
        tree.find('cats').add('ornata');
        tree.find('cats').add('reyi');
        tree.find('cats').add('rubida');
        tree.find('cats').add('tristrami');
        tree.find('cats').add('ugandae');
        tree.find('mammals').add('marsupials');
        tree.find('marsupials').add('opossum');
        tree.find('marsupials').add('mole');
        tree.find('marsupials').add('kowari');
        tree.find('marsupials').add('kaluta');
        tree.find('marsupials').add('quoll');
        tree.find('mammals').add('fox');
        tree.find('fox').add('cerdocyon');
        tree.find('fox').add('otocyon');
        tree.find('fox').add('grayfox');
        tree.find('fox').add('fennecfox');
        tree.find('fox').add('arcticfox');
        tree.find('fox').add('redfox');
        tree.find('mammals').add('marine');
        tree.find('marine').add('dolphin');
        tree.find('marine').add('seal');
        tree.find('marine').add('manatee');
        tree.find('marine').add('sealion');
        tree.find('marine').add('otter');
        tree.add('reptiles');
        tree.find('reptiles').add('gecko');
        tree.find('reptiles').add('tortoise');
        this._tree = tree;

        /* Step 2: Create Graph */
        this._graph = [
            new Dependency('marmoset', 'tortoise')
            // Because the marmoset likes to ride on a tortoise
        ];

        /* Step 3: Create versions */
        this._versions = [
            new Version('alpha', 'Two Weeks before Opening', 1462060800),
            new Version('v1.0',  'Opening Day', 1463216400)
        ];
        this._versions.sort(function(a, b) { return a - b;}); // Ensure order

        /* Step 4: Create Attributes */
        this._attributes = {};
        for (var v of this._versions) {
            this._attributes[String(v)] = {};
            this._createAttributes(this._tree, v);
        }
    };

    _createAttributes(tree, version) {
        if (!tree.children.length) {
            if (this.exists(tree, version)) {
                var t = String(tree);
                var v = String(version);
                this._attributes[v][t] = {
                    'name': t,
                    'loc' : this._hashString('loc' + t + v) % 687,
                    'editors' : 1 + this._hashString('edit' + t + v) % 14
                }
            }
            return;
        }

        for (var c of tree.children) {
            this._createAttributes(c, version);
        }
    }

    _hashString(str) {
        // https://github.com/darkskyapp/string-hash
        var hash = 17,
            i    = str.length
        while(i) {
            hash = (hash * 11) ^ str.charCodeAt(--i)
        }
        return hash >>> 0;
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

    /**
     * Existence Function for Animals on Snapshots
     * @param  {string} node    Node
     * @param  {string} version Version
     * @return {boolean}
     */
    exists(node, version) {
        // In Alpha-Version, some animals were missing
        if (String(version) === 'alpha') {

            // Only Cats, whose name began with 'a-i' were available
            var cats = this._tree.find('cats');
            if (cats && cats.find(node)) {
                return String(node)[0] <= 'i';
            }

            // Since Reptiles were acquired later, they are first available on opening day
            var mammals = this._tree.find('mammals');
            return mammals && mammals.find(node) ? true :false;
        }

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

module.exports = ZooModel;
