var BaseContainer = require("./base.js");

/**
 * Containers are able to mirror the placement algorithm on the X-Axis.
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */
class MirrorContainer extends BaseContainer {

    constructor(key, mirror = false) {
        super(key);
        this._mirrored = mirror;
        this._separator = 0;
    };

    add(shape) {
        super.add(shape);

        if (this._mirrored) {
            shape.rotate(180);
        }
    };

    get isMirrored() {
        return this._mirrored;
    };

    set separator(val) {
        this._separator = val;
    };

    get separator() {
        return this._separator;
    };
};

module.exports = MirrorContainer;
