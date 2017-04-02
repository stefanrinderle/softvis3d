export class Event<T> {
    private _type: T;

    constructor(type: T) {
        this._type = type;
    }

    public getType(): T {
        return this._type;
    }
}

export class EventDispatcher<T> {
    private _listeners: any[];

    constructor() {
        this._listeners = [];
    }

    public hasEventListener(listener: Function): Boolean {
        let exists: Boolean = false;
        for (let listenerElement of this._listeners) {
            if (listenerElement === listener) {
                exists = true;
            }
        }

        return exists;
    }

    public addEventListener(listenerFunc: Function): void {
        if (this.hasEventListener(listenerFunc)) {
            return;
        }

        this._listeners.push({listener: listenerFunc});
    }

    public removeEventListener(listenerFunc: Function): void {
        for (let i = 0; i < this._listeners.length; i++) {
            if (this._listeners[i].listener === listenerFunc) {
                this._listeners.splice(i, 1);
            }
        }
    }

    public dispatchEvent(evt: Event<T>) {
        for (let listenerElement of this._listeners) {
            listenerElement.call(this, evt);
        }
    }
}