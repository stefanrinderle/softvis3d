/**
 * A Classic
 */
class TreeNode {
    /**
     * Create a new TreeNode
     * @param  {string}   key Identifier for this node
     * @return {function}     Get a fresh TreeNode-Object
     */
    constructor(key) {
        this._key       = key;
        this._children = [];
        this._parent   = null;
    };

    /**
     * Convert Object to String (it's key)
     * @return {string}
     */
    toString() {
        return this._key;
    };

    /**
     * Add a new Child to this node
     * @param {string|function} child Give a key (string) or an already configured node
     */
    add(child) {
        if (typeof child !== 'function') {
            child = new TreeNode(child);
        }

        child.parent = this;
        this._children.push(child);
    };

    /**
     * Find recursivly finds the node. If it is not part of the tree, return false [depth-first search]
     * @param  {string} key Item to find
     * @return {boolean|function}
     */
    find(key) {
        if (this._key == key) {
            return this;
        }

        for (var child of this._children) {
            var result = child.find(key);
            if (result) {
                return result;
            }
        }

        return false;
    };

    /**
     * Get All children
     * @return {Array}
     */
    get children() {
        return this._children;
    };

    /**
     * Get this node's parent. Returns null, if none is available 
     * @return {function|null}
     */
    get parent() {
        return this._parent;
    };

    /**
     * Set this node's parent
     * @param  {function} node
     */
    set parent(node) {
        this._parent = node;
    };
}

module.exports = TreeNode;
