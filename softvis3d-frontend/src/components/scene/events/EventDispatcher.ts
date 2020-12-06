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

import Event from "./Event";

export class EventDispatcher<T> {
    private _listeners: { (event: Event<T>): void }[];

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
