import dispatcher from "../dispatcher";
import * as Actions from "../constants/ActionConstants";

export function initApp() {
    dispatcher.dispatch({
        type: Actions.INIT_APP,
        payload: {}
    });
}

export function availableMetricsLoaded() {
    dispatcher.dispatch({
        type: Actions.METRICS_LOADED,
        payload: {}
    });
}