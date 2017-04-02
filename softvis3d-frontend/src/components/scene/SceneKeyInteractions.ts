///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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

import {Event, EventDispatcher} from "./EventDispatcher";
export class SceneKeyInteractions {

    private static EVENT_KEY_DOWN: string = "keydown";

    private static KEY_CODE_R: number = 82;
    private static KEY_CODE_L: number = 76;

    private _onResetCameraEvent: EventDispatcher<void> = new EventDispatcher<void>();
    private _onToggleLegendEvent: EventDispatcher<void> = new EventDispatcher<void>();

    constructor() {
        window.addEventListener(SceneKeyInteractions.EVENT_KEY_DOWN, this.handleKeyDown.bind(this));
    }

    public unmount() {
        window.removeEventListener(SceneKeyInteractions.EVENT_KEY_DOWN, this.handleKeyDown.bind(this));
    }

    public handleKeyDown(event: KeyboardEvent) {
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

    public get onResetCameraEvent(): EventDispatcher<void> {
        return this._onResetCameraEvent;
    }

    public get onToggleLegendEvent(): EventDispatcher<void> {
        return this._onToggleLegendEvent;
    }

}
