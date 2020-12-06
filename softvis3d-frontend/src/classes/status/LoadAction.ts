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

export default class LoadAction extends StatusAction {
    private _max?: number;
    private _current?: number;

    constructor(key: string, description: string) {
        super(key, description);
    }

    public setStatus(max: number, current: number) {
        this._max = max;
        this._current = current;
    }

    public get max(): number | undefined {
        return this._max;
    }

    public get current(): number | undefined {
        return this._current;
    }

    public incrementMax() {
        if (typeof this._max !== "undefined") {
            this._max = this._max + 1;
        }
    }

    public incrementCurrent() {
        if (typeof this._current !== "undefined") {
            this._current = this._current + 1;
        }
    }

    public hasStatus(): boolean {
        return typeof this._current !== "undefined" && typeof this._max !== "undefined";
    }

    public get percent(): number {
        if (typeof this._current !== "undefined" && typeof this._max !== "undefined") {
            return Math.floor((100 / this._max) * this._current);
        } else {
            return 100;
        }
    }
}
