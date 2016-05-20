/**
 * A Software Dependency
 */
class Dependency {
    /**
     * Create a new software version
     * @param  {string}   identifier Key/Identifier for this node
     * @return {function}            Get a fresh Dependency-Object
     */
    constructor(source, target) {
        this._source = source;
        this._target = target;
    };

    /**
     * Convert Object to String
     * @return {string}
     */
    toString() {
        return this._source + ' -> + ' + this._target;
    };

    get source() {
        return this._source;
    };

    get target() {
        return this._target;
    };
}

module.exports = Dependency;
