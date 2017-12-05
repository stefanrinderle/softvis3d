export default class Event<T> {

    private _value: T;

    constructor(type: T) {
        this._value = type;
    }

    public getValue(): T {
        return this._value;
    }
}