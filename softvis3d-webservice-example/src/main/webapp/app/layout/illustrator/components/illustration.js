/**
 * This is what a SoftwareModel has to look like
 * 
 * @interface
 */
class BaseIllustration {
    constructor(version) {
        this._version = version;
        this._shapes  = [];
    };

    get version() {
        return this._version;
    };

    get shapes() {
        return this._shapes;
    };

    addShape(shape) {
        this._shapes.push(shape);
    };
}

module.exports = BaseIllustration;