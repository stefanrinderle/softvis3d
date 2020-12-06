import Event from "./Event";

export class EventDispatcher<T> {
    private _listeners: {(event: Event<T>): void;}[];

    constructor() {
        this._listeners = [];
    }

    public addEventListener(listenerFunc: (evt: Event<T>) => void): void {
        if (this.hasEventListener(listenerFunc)) {
            return;
        }

        this._listeners.push(listenerFunc);
    }

    public removeEventListener(listenerFunc: (evt: Event<T>) => void): void {
        for (let i = 0; i < this._listeners.length; i++) {
            if (this._listeners[i] === listenerFunc) {
                this._listeners.splice(i, 1);
            }
        }
    }

    public dispatchEvent(evt: Event<T>) {
        for (const listenerElement of this._listeners) {
            listenerElement.call(this, evt);
        }
    }

    private hasEventListener(listener: (evt: Event<T>) => void): boolean {
        return this._listeners.indexOf(listener) >= 0;
    }
}