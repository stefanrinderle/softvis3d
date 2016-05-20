var Row    = require("../row.js");
var Cuboid = require("../../components/cuboid.js");

/**
 * Strip is a helperclass for the GRID-Algorithm. 
 * It's contents shall not be shared. with other classes.
 */
class Strip {
    constructor(name, mirrored) {
        this._offset = 0;
        this._dimensions = new Cuboid();
        this._container = new Row(name, mirrored);

        if (mirrored) {
            this._container.rotate(180);
        }
    };

    get container() {
        return this._container;
    };

    get dimensions() {
        return this._dimensions;
    };

    get offset() {
        return this._offset;
    };

    set offset(val) {
        this._offset = val;
    };

    add(shape) {
        var recommendOffsetRecalculation = this.dimensions.length && this.dimensions.width < shape.displayDimensions.width;

        this.dimensions.length += shape.displayDimensions.length;
        this.dimensions.width  = Math.max(this.dimensions.width, shape.displayDimensions.width);
        this.dimensions.height = Math.max(this.dimensions.height, shape.displayDimensions.height);

        this._container.add(shape);

        return recommendOffsetRecalculation;
    };
};

module.exports = Strip;
