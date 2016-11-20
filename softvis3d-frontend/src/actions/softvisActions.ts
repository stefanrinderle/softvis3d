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

import dispatcher from "../dispatcher";
import * as Actions from "../constants/ActionConstants";

export function initApp() {
    dispatcher.dispatch({
        type: Actions.INIT_APP,
        payload: {}
    });
}

export function loadAvailableMetrics() {
    dispatcher.dispatch({
        type: Actions.LOAD_ACTION,
        payload: Actions.METRICS_LOADED
    });
}

export function availableMetricsLoaded() {
    dispatcher.dispatch({
        type: Actions.METRICS_LOADED,
        payload: {}
    });
}

export function createScene() {
    dispatcher.dispatch({
        type: Actions.SCENE_CREATE,
        payload: {}
    });

    dispatcher.dispatch({
        type: Actions.LOAD_ACTION,
        payload: Actions.SCENE_CREATED
    });
}

export function sceneSuccessfullyCreated() {
    dispatcher.dispatch({
        type: Actions.SCENE_CREATED,
        payload: {}
    });
}