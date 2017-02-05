import StatusAction from "./StatusAction";
import {computed, observable} from "mobx";

export default class StatusActionQueue<T extends StatusAction> implements IterableIterator<StatusAction> {

    @observable
    private _queue: T[] = [];
    private _pointer: number = 0;

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

    public next(): IteratorResult<T> {
        if (this._pointer < this._queue.length) {
            return {
                done: false,
                value: this._queue[this._pointer++]
            };
        } else {
            this._pointer = 0;
            return {
                done: true,
                // TODO: examples did not have a value on done: true. But did not compile without a value.
                value: this._queue[0]
            };
        }
    }

    public [Symbol.iterator](): IterableIterator<StatusAction> {
        return this;
    }

}