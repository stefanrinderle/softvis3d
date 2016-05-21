/**
 * A Software Version
 */
class Version {
    /**
     * Create a new software version
     * @param  {string}   key   Identifier for this node
     * @param  {string}   label Versions (public) Label
     * @param  {int}      order Value of this version (Highest value is the latest version)
     * @return {function}       Get a fresh Version-Object
     */
    constructor(key, label, order = 0) {
        this._key   = key;
        this._label = label;
        this._value = parseInt(order);
    };

    /**
     * Convert Object to String (it's key)
     * @return {string}
     */
    toString() {
        return this._key;
    };

    /**
     * Value of this version (for comparison)
     * @return {int}
     */
    valueOf() {
        return this._value;
    }

    /**
     * Get this versions model-identifier
     * @return {string}
     */
    get key() {
        return this._key;
    };

    /**
     * Get this versions Label
     * @return {string}
     */
    get label() {
        return this._label;
    };
}

module.exports = Version;
