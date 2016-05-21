class Cuboid {
    constructor(length = 0, width = 0, height = 0) {
        this._length = length;
        this._width  = width;
        this._height = height;
    };

    toString() {
        return `[${this._width} x ${this.length} x ${this.height}]`;
    };

    set length(length) {
        this._length = length;
    };

    set width(width) {
        this._width = width;
    };

    set height(height) {
        this._height = height;
    };

    get length() {
        return this._length;
    };

    get width() {
        return this._width;
    };

    get height() {
        return this._height;
    }

    get diagonal() {
        return Math.sqrt(Math.pow(this.length, 2) + Math.pow(this.width, 2) + Math.pow(this.height, 2));
    }

    get base() {
        return Math.sqrt(Math.pow(this.length, 2) + Math.pow(this.width, 2));
    }
}

module.exports = Cuboid;
