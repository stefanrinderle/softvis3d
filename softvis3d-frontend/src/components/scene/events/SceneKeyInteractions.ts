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

import { EventDispatcher } from "./EventDispatcher";
import Event from "./Event";

export class SceneKeyInteractions {

    // to be able to mock the construction
    public static create() {
        return new SceneKeyInteractions();
    }

    private static EVENT_KEY_DOWN = "keydown";

    private static KEY_CODE_R = 82;
    private static KEY_CODE_L = 76;

    private _onResetCameraEvent: EventDispatcher<void> = new EventDispatcher<void>();
    private _onToggleLegendEvent: EventDispatcher<void> = new EventDispatcher<void>();

    private active: boolean;

    private constructor(active = false) {
        window.addEventListener(SceneKeyInteractions.EVENT_KEY_DOWN, (event) => {
            this.handleKeyDown(event as KeyboardEvent);
        });
        this.active = active;
    }

    public destroy() {
        window.removeEventListener(SceneKeyInteractions.EVENT_KEY_DOWN, (event) => {
            this.handleKeyDown(event as KeyboardEvent);
        });
    }

    public addResetCameraEventListener(callback: (evt: Event<void>) => void) {
        this._onResetCameraEvent.addEventListener(callback);
    }

    public addToggleLegendEventListener(callback: (evt: Event<void>) => void) {
        this._onToggleLegendEvent.addEventListener(callback);
    }

    public halt() {
        this.active = false;
    }

    public resume() {
        this.active = true;
    }

    // public for tests
    public handleKeyDown(event: KeyboardEvent) {
        if (!this.active) {
            return;
        }

        switch (event.keyCode) {
            case SceneKeyInteractions.KEY_CODE_R:
                this._onResetCameraEvent.dispatchEvent(new Event<void>(undefined));
                break;
            case SceneKeyInteractions.KEY_CODE_L:
                this._onToggleLegendEvent.dispatchEvent(new Event<void>(undefined));
                break;
            default:
            // KEY NOT REGISTERED
        }
    }

}
