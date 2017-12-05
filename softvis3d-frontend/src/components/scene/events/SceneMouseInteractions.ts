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

import { HtmlDom } from "../../../services/HtmlDom";
import { EventDispatcher } from "./EventDispatcher";
import Event from "./Event";
import Scene from "../Scene";

export class SceneMouseInteractions {

    // to be able to mock the construction
    public static create() {
        return new SceneMouseInteractions();
    }

    private static EVENT_MOUSE_DOWN: string = "mousedown";

    /**
     * global window object mouse down event.
     */
    private _onMouseDownEvent: EventDispatcher<boolean> = new EventDispatcher<boolean>();
    private _onMouseMovedEvent: EventDispatcher<void> = new EventDispatcher<void>();
    private _onSelectObjectEvent: EventDispatcher<MouseEvent> = new EventDispatcher<MouseEvent>();
    private _mouseMoved: boolean = false;

    private constructor() {
        window.addEventListener(SceneMouseInteractions.EVENT_MOUSE_DOWN, this.handleMouseDown.bind(this));
    }

    public destroy() {
        window.removeEventListener(SceneMouseInteractions.EVENT_MOUSE_DOWN, this.handleMouseDown.bind(this));
    }

    public addMouseDownEventListener(callback: Function) {
        this._onMouseDownEvent.addEventListener(callback);
    }

    public addMouseMovedEventListener(callback: Function) {
        this._onMouseMovedEvent.addEventListener(callback);
    }

    public addSelectObjectEventEventListener(callback: Function) {
        this._onSelectObjectEvent.addEventListener(callback);
    }

    public handleMouseDown(event: MouseEvent) {
        const self = document.getElementById(Scene.SCENE_CONTAINER_ID);
        let isWithinScene = event.target === self || HtmlDom.isDescendant(self, event.target as HTMLElement);

        this._onMouseDownEvent.dispatchEvent(new Event<boolean>(isWithinScene));
    }

    public setMouseMoved(mouseMoved: boolean) {
        this._mouseMoved = mouseMoved;
    }

    public onMouseUp(event: any) {
        this._onMouseMovedEvent.dispatchEvent(new Event<void>(undefined));

        if (!this._mouseMoved) {
            this._onSelectObjectEvent.dispatchEvent(new Event<MouseEvent>(event));
        }
    }

}
