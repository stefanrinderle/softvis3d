/* tslint:disable */
import * as Actions from "../constants/ActionConstants";
import axios, {AxiosPromise, AxiosRequestConfig} from "axios";
import config from "config";
import cityBuilderConfig, {CityBuilderConfig} from "../stores/CityBuilder";
import * as softvisActions from "../actions/softvisActions";
import {Metric} from "../interfaces/Metric";

interface SEvent {
    type: string;
    payload?: any;
}

export class SonarQubeStore {
    private store: CityBuilderConfig;

    constructor() {
        this.store = cityBuilderConfig;
        // Stuff
    }

    public handleEvents(event: SEvent): void {
        switch (event.type) {
            case Actions.INIT_APP:
                this.loadAvailableMetrics();
                return;
            default:
                // no Action
        }
    }

    private callApi(route: string, options: AxiosRequestConfig = {}): AxiosPromise {
        return axios.get(config.api + route, options);
    }

    private loadAvailableMetrics(page = 1) {
        this.callApi("/metrics/search?f=name&p=" + page).then(response => {
            this.store.addAvailableMetrics((response.data.metrics as Array<Metric>).filter(c => c.type === "INT"));

            const metricsCount = response.data.p * response.data.ps;
            if (metricsCount < response.data.total) {
                this.loadAvailableMetrics(page + 1);
            } else {
                softvisActions.availableMetricsLoaded();
            }
        }).catch(err => {
            console.log(err);
        });
    }
}