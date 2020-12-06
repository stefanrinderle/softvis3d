///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import StatusAction from "./StatusAction";
import { computed, observable } from "mobx";

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

    /**
     * As only the content of the action changes, queue has to be recreated
     * for the @observable to fire an event.
     *
     * @returns new instance of StatusActionQueue<T>.
     */
    public update(action: T): StatusActionQueue<T> {
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
        for (const element of this._queue) {
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
