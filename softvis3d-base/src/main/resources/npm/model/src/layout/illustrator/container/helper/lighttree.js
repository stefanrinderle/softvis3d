var Cuboid = require("../../components/cuboid.js");
var Point  = require("../../components/point.js");

class Lighttree {
    constructor(origin, dimensions) {
        this._origin = origin;
        this._dimensions = dimensions;
        this._content = null;
        this._children = [];
    };

    get origin() {
        return this._origin;
    };

    get dimensions() {
        return this._dimensions;
    };

    get content() {
        return this._content;
    };

    contentFits(measurements) {
        if (this._content) {
            return false;
        }

        return (this.dimensions.length >= measurements.length && this.dimensions.width >= measurements.width);
    };

    collectCandidates(collection, measurements) {
        if (this._children.length) {
            for (var c of this._children) {
                c.collectCandidates(collection, measurements);
            }
        } else if (this.contentFits(measurements)) {
            collection.push(this);
        }
    };

    collectNodesWithContent(collection) {
        if (this._children.length) {
            for (var c of this._children) {
                c.collectNodesWithContent(collection);
            }
        } else if (this._content) {
            collection.push(this);
        }
    };

    insert(measurements, object, cutHorizontalFirst = true) {
        if (!this.contentFits(measurements)) {
            throw 'Object does not fit!'
        }

        var cutOrder = [
            { 'method' : this.cutIfWidthDoesNotFit.bind(this),  'value' : measurements.width },
            { 'method' : this.cutIfLengthDoesNotFit.bind(this), 'value' : measurements.length }
        ];

        if(!cutHorizontalFirst) {
            cutOrder.reverse();
        }

        // If the object would not fit perfectly, we need to cut the
        // area in up to three new (smaller) areas
        for (var cut of cutOrder) {
            cut['method'](cut['value']);

            if (this._children.length) {
                return this._children[0].insert(measurements, object, cutHorizontalFirst);
            }
        }

        // Object fits perfectly
        this._content = object;
        return this;
    };

    cutIfWidthDoesNotFit(width) {
        // The Objects width, does not perfectly fit the available width.
        // Split the plane in two and insert the object into the fitting one
        if (this.dimensions.width > width) {

            var o1 = new Point(
                this.origin.x,
                this.origin.y,
                this.origin.z
            );
            var d1 = new Cuboid(
                this.dimensions.length,
                width,
                this.dimensions.height
            );
            this._children.push(new Lighttree(o1, d1));

            var o2 = new Point(
                this.origin.x,
                this.origin.y + width,
                this.origin.z
            );
            var d2 = new Cuboid(
                this.dimensions.length,
                this.dimensions.width - width,
                this.dimensions.height
            );
            this._children.push(new Lighttree(o2, d2));
        }
    };

    cutIfLengthDoesNotFit(length) {
        // The Objects length, does not perfectly fit the available length.
        // Split the plane in two and insert the object into the fitting one
        if (this.dimensions.length > length) {

            var o1 = new Point(
                this.origin.x,
                this.origin.y,
                this.origin.z
            );
            var d1 = new Cuboid(
                length,
                this.dimensions.width,
                this.dimensions.height
            );
            this._children.push(new Lighttree(o1, d1));

            var o2 = new Point(
                this.origin.x + length,
                this.origin.y,
                this.origin.z
            );
            var d2 = new Cuboid(
                this.dimensions.length - length,
                this.dimensions.width,
                this.dimensions.height
            );
            this._children.push(new Lighttree(o2, d2));
        }
    };
};

module.exports = Lighttree;
