import StatusAction from "./StatusAction";
import {computed, observable} from "mobx";

export default class StatusActionQueue<T extends StatusAction> {
    @observable
    private _queue: T[] = [];

    public add(action: T) {
        this._queue.push(action);
    }

    public copyAndRemove(action: T): StatusActionQueue<T> {
        let newQueue: StatusActionQueue<T> = new StatusActionQueue<T>();
        for (let element of this._queue) {
            if (element.key !== action.key) {
                newQueue.add(element);
            }
        }
        return newQueue;
    }

    public remove(action: T) {
        for (let i = 0; i < this._queue.length; i++) {
            if (this._queue[i].key === action.key) {
                this._queue.splice(i, 1);
                return;
            }
        }

        // tslint:disable-next-line no-console
        console.error("Could not remove action: " + JSON.stringify(action));
    }

    public copyAndAdd(action: T): StatusActionQueue<T> {
        let newQueue: StatusActionQueue<T> = new StatusActionQueue<T>();
        for (let element of this._queue) {
            newQueue.add(element);
        }
        newQueue.add(action);
        return newQueue;
    }

    public copyAndUpdate(action: T): StatusActionQueue<T> {
        const newQueue: StatusActionQueue<T> = new StatusActionQueue<T>();
        for (const element of this._queue) {
            if (element.key === action.key) {
                newQueue.add(action);
            } else {
                newQueue.add(element);
            }
        }
        return newQueue;
    }

    public getAction(key: string): T | undefined {
        for (let element of this._queue) {
            if (element.key === key) {
                return element;
            }
        }
        return undefined;
    }

    @computed
    public get isEmpty(): boolean {
        return this._queue.length === 0;
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return this._queue[Symbol.iterator]();
    }
}