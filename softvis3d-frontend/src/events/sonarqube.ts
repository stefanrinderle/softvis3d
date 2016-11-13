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

/* tslint:disable */
import * as Actions from "../constants/ActionConstants";
import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import config from "config";
import cityBuilderStore, { CityBuilderStore } from "../stores/CityBuilderStore";
import * as softvisActions from "../actions/softvisActions";

interface SEvent {
    type: string;
    payload?: any;
}

export class SonarQubeCommunicator {
    private store: CityBuilderStore;

    constructor() {
        this.store = cityBuilderStore;
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