class Point {
    constructor(x = 0, y = 0, z = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
    };

    toString() {
        return `[${this._x}:${this._y}:${this._z}]`;
    };

    get x() {
        return this._x;
    };

    get y() {
        return this._y;
    };

    get z() {
        return this._z;
    };

    set x(x) {
        this._x = x;
    };

    set y(y) {
        this._y = y;
    };

    set z(z) {
        this._z = z;
    };
}

module.exports = Point;
