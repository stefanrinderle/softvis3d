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

import { BackendService } from "./BackendService";

export interface SonarQubeComponentInfo {
    id: number;
    key: string;
    name: string;
    analysisDate: Date;
    leakPeriodDate: Date;
}

export default class SonarQubeComponentInfoService extends BackendService {
    /**
     * Only available (with the implemented parameters) from SQ version 6.4.
     *
     * Error handling should be done by the caller.
     */
    public loadComponentInfo(): void {
        const componentStore = this.componentStatusStore;
        const params = { component: componentStore.appConfiguration.projectKey };
        this.callApi("/components/show", { params })
            .then((response) => {
                const component = response.data.component;

                componentStore.lastAnalysisDate = new Date(component.analysisDate);
                componentStore.leakPeriodDate = new Date(component.leakPeriodDate);
            })
            .catch((error) => {
                /**
                 * Does not throw an application error because the api/component/show web-api changed in version 6.4
                 * and we currently support SQ versions > 6.3.
                 */
                componentStore.lastAnalysisDate = undefined;
                componentStore.leakPeriodDate = undefined;

                console.error(error.response.data);
            });
    }
}
