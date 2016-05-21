var Cuboid = require("../components/cuboid.js");
var Point   = require("../components/point.js");
/**
 * All shapes occupy a square area.
 * It's dimensions are described by the vector `dimensions`.
 * It can be placed and rotated around the shapes centroid.
 * 
 * @interface
 */
class BaseShape {
    constructor(key) {
        this._key = String(key);

        this._hasBeenDrawn = false;
        this._absolutePosition = null;
        this._absoluteRotation = 0;

        this._attributes = {
            key: key,
            dimensions: new Cuboid(),
            position: new Point(),
            rotation: 0,
            margin: 0
        };
    };

    /**
     * The shapes (and it's associated model nodes) identifier
     * @return {String}
     */
    get key() {
        return this._key;
    };

    /**
     * Set the margin for this Shape
     * @param  {int} margin
     */
    set margin(margin) {
        this._attributes.margin = margin;
    };

    /**
     * Set the margin for this Shape
     * @param  {int} margin
     */
    get margin() {
        return this._attributes.margin;
    }

    /**
     * Get this shapes position, relative to it's parents centroid
     * @return {Point}
     */
    get position() {
        return this._attributes.position;
    }

    /**
     * Get the Shape's qubic cuboidments (before any rotation)
     * @return {Cuboid}
     */
    get dimensions() {
        return this._attributes.dimensions;
    };

    /**
     * Get the shape's qubic cuboidments
     * @return {Cuboid}
     */
    get displayDimensions() {
        var swap = this.rotation % 180;
        var l = this.dimensions.length + 2 * this.margin;
        var w = this.dimensions.width  + 2 * this.margin;
        var h = this.dimensions.height + 2 * this.margin;
        return new Cuboid(
            swap ? w  : l,
            swap ? l : w,
            h
        );
    };

    /**
     * Get the shapes centroid (with relative rotation)
     * @return {Point}
     */
    get centroid () {
        return new Point(
            this.displayDimensions.length / 2,
            this.displayDimensions.width / 2
        );
    };

    /**
     * Get the relative rotation
     * @return {int}
     */
    get rotation() {
        return this._attributes.rotation;
    };

    /**
     * Rotation the shape around the it's centroid.
     * @param  {int} degrees clockwise rotation
     */
    rotate(degrees){
        if (degrees % 90) {
            throw 'Only 90° rotations allowed'
        }

        this._attributes.rotation = (720 + this.rotation + degrees) % 360;
    };

    /**
     * Draw the Shape (calculate final absolute position and rotation)
     * @param  {Point} parentPosition
     * @param  {int}   parentRotation [description]
     */
    draw(parentPosition, parentRotation) {
        var a = (720 - parentRotation) % 360;
        var rad = a * (Math.PI / 180);
        var transformedRelativePosition = new Point(
            Math.cos(rad) * this.position.x - Math.sin(rad) * this.position.y,
            Math.sin(rad) * this.position.x + Math.cos(rad) * this.position.y,
            this.position.z
        );

        this._absolutePosition = new Point(
            parentPosition.x + transformedRelativePosition.x,
            parentPosition.y + transformedRelativePosition.y,
            parentPosition.z + transformedRelativePosition.z
        );

        this._absoluteRotation = (360 + parentRotation + this.rotation) % 360;

        this._hasBeenDrawn = true;
    };

    /**
     * Draw the Shape
     * @return {Object}
     */
    getSpatialInformation() {
        if (!this._hasBeenDrawn) {
            throw 'Node has not been drawn yet';
        }

        var swap = this._absoluteRotation % 180;
        var rotatedDimensions = new Cuboid(
            swap ? this.dimensions.width  : this.dimensions.length,
            swap ? this.dimensions.length : this.dimensions.width,
            this.dimensions.height
        );

        var spatialInformation = {};
        Object.assign(spatialInformation, this._attributes);

        spatialInformation.dimensions = rotatedDimensions;
        spatialInformation.position = this._absolutePosition;
        spatialInformation.rotation = this._absoluteRotation;

        return [ spatialInformation ];
    };

    /**
     * Updates the internal Attributes for the SpatialInformation.
     * Also applies Spatial Data for this Shape directly.
     * @param  {Object} attributes
     */
    updateAttributes(attributes) {
        for (var key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                var value = attributes[key];
                this._updateAttribute(this._attributes, key.split('.'), value);
            }
        }
    }

    _updateAttribute(obj, keys, value) {
        var k = keys.shift();
        if (!keys.length) {
            obj[k] = value;
        } else {
            if(!(k in obj)) {
                obj[k] = {};
            }
            this._updateAttribute(obj[k], keys, value);
        }
    }

    getAttribute(key) {
        var keys = key.split('.');
        var attr = this._attributes;
        while(keys.length && (attr = attr[keys.shift()]));
        return attr;
    }
}

module.exports = BaseShape;
