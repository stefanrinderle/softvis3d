/**
 * This is what a SoftwareModel has to look like
 * 
 * @interface
 */
class BaseSoftwareModel {
    constructor() {};

    /**
     * Get the Models Graph. A List of Objects, connecting `source` and `target`.
     * @return {object}
     */
    get graph() {};

    /**
     * Get the Root-Node of the tree.
     * @return {TreeNode}
     */
    get tree() {};

    /**
     * Get an ordered List of all versions.
     * @return {array<Version>}
     */
    get versions() {};

    /**
     * Existence Function
     * @param  {Treenode} node    Node-Object
     * @param  {Version}  version Version-Object
     * @return {boolean}
     */
    exists(node, version) {};

    /**
     * Property function
     * @param  {Treenode} node    Node-Object
     * @param  {Version}  version Version-Object
     * @return {null|object}
     */
    attributes(node, version) {};
}

module.exports = BaseSoftwareModel;