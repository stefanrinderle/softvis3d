import StatusAction from "./StatusAction";
import {computed, observable} from "mobx";

export default class StatusActionQueue<T extends StatusAction> {
    @observable
    private _queue: T[] = [];

    public add(action: T) {
        this._queue.push(action);
    }

    public remove(action: T) {
        for (let i = 0; i < this._queue.length; i++) {
            if (this._queue[i].key === action.key) {
                this._queue.splice(i, 1);
                return;
            }
        }

        console.error("Could not remove action: " + JSON.stringify(action));
    }

    @computed
    public get isEmpty(): boolean {
        return this._queue.length === 0;
    }

    public get queue(): T[] {
        return this._queue;
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return this._queue[Symbol.iterator]();
    }
}