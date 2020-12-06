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

import {lazyInject} from "../../../inversify.config";
import {HtmlDomService} from "../../../services/HtmlDomService";
import Scene from "../Scene";
import Event from "./Event";
import {EventDispatcher} from "./EventDispatcher";

export class SceneMouseInteractions {

    // to be able to mock the construction
    public static create() {
        return new SceneMouseInteractions();
    }

    private static EVENT_MOUSE_DOWN = "mousedown";

    @lazyInject("HtmlDomService")
    private readonly htmlDomService!: HtmlDomService;

    /**
     * global window object mouse down event.
     */
    private _onMouseDownEvent: EventDispatcher<boolean> = new EventDispatcher<boolean>();
    private _onMouseMovedEvent: EventDispatcher<void> = new EventDispatcher<void>();
    private _onSelectObjectEvent: EventDispatcher<MouseEvent> = new EventDispatcher<MouseEvent>();
    private _mouseMoved = false;

    private constructor() {
        window.addEventListener(SceneMouseInteractions.EVENT_MOUSE_DOWN, (event) => {
            this.handleMouseDown(event as MouseEvent);
        });
    }

    public destroy() {
        window.removeEventListener(SceneMouseInteractions.EVENT_MOUSE_DOWN, (event) => {
            this.handleMouseDown(event as MouseEvent);
        });
    }

    public addMouseDownEventListener(callback: (event: Event<boolean>) => void) {
        this._onMouseDownEvent.addEventListener(callback);
    }

    public addMouseMovedEventListener(callback: () => void) {
        this._onMouseMovedEvent.addEventListener(callback);
    }

    public addSelectObjectEventEventListener(callback: (event: Event<MouseEvent>) => void) {
        this._onSelectObjectEvent.addEventListener(callback);
    }

    public handleMouseDown(event: MouseEvent) {
        const self = document.getElementById(Scene.SCENE_CONTAINER_ID);
        const isWithinScene = event.target === self || this.htmlDomService.isDescendant(self, event.target as HTMLElement);

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
