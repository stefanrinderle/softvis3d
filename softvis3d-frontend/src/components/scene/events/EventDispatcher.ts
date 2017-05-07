import Event from "./Event";

export class EventDispatcher<T> {
    private _listeners: Function[];

    constructor() {
        this._listeners = [];
    }

    public addEventListener(listenerFunc: Function): void {
        if (this.hasEventListener(listenerFunc)) {
            return;
        }

        this._listeners.push(listenerFunc);
    }

    public removeEventListener(listenerFunc: Function): void {
        for (let i = 0; i < this._listeners.length; i++) {
            if (this._listeners[i] === listenerFunc) {
                this._listeners.splice(i, 1);
            }
        }
    }

    public dispatchEvent(evt: Event<T>) {
        for (let listenerElement of this._listeners) {
            listenerElement.call(this, evt);
        }
    }

    private hasEventListener(listener: Function): boolean {
        return this._listeners.indexOf(listener) >= 0;
    }
}