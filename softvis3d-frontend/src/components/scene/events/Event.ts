export default class Event<T> {
    private _type: T;

    constructor(type: T) {
        this._type = type;
    }

    public getType(): T {
        return this._type;
    }
}