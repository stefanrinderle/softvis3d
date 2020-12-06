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

import {computed, observable} from "mobx";
import LoadAction from "../classes/status/LoadAction";
import ErrorAction from "../classes/status/ErrorAction";
import StatusActionQueue from "../classes/status/StatusActionQueue";
import StatusAction from "../classes/status/StatusAction";

export default class AppStatusStore {

    @observable
    public showLoadingQueue = false;
    @observable
    public loadingQueue: StatusActionQueue<LoadAction> = new StatusActionQueue<LoadAction>();
    @observable
    public statusQueue: StatusActionQueue<StatusAction> = new StatusActionQueue<StatusAction>();
    @observable
    public errors: StatusActionQueue<ErrorAction> = new StatusActionQueue<ErrorAction>();
    @observable
    public analysisDate?: Date;

    @computed
    get isVisible() {
        return !(this.loadingQueue.isEmpty && this.errors.isEmpty && this.statusQueue.isEmpty);
    }

    public status(action: StatusAction): void {
        this.statusQueue.add(action);
    }

    public removeStatus(action: StatusAction): void {
        this.statusQueue.remove(action);
    }

    public load(action: LoadAction): void {
        this.loadingQueue.add(action);
    }

    public loadStatusUpdate(actionKey: string, max: number, current: number): void {
        const savedAction = this.loadingQueue.getAction(actionKey);

        if (savedAction) {
            savedAction.setStatus(max, current);
            this.loadingQueue = this.loadingQueue.update(savedAction);
        }
    }

    public loadComplete(action: LoadAction): void {
        this.loadingQueue.remove(action);
    }

    public error(error: ErrorAction): void {
        this.errors.add(error);
    }

    public acknowledgeError(error: ErrorAction): void  {
        this.errors.remove(error);
    }
}