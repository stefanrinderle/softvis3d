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
import { BackendService } from "./BackendService";

export interface SonarQubeComponentInfo {
    id: number;
    key: string;
    name: string;
    analysisDate: Date;
}

export default class SonarQubeComponentInfoService extends BackendService {

    private projectKey: string;

    constructor(projectKey: string, baseUrl?: string) {
        super(baseUrl);

        this.projectKey = projectKey;
    }

    /**
     * Only available (with the implemented parameters) from SQ version 6.4.
     *
     * Error handling should be done by the caller.
     */
    public loadComponentInfo(): Promise<SonarQubeComponentInfo> {
        return new Promise<SonarQubeComponentInfo>((resolve, reject) => {
            const params = {component: this.projectKey};
            this.callApi("/components/show", {params}).then((response) => {

                response.data.component.analysisDate = new Date(response.data.component.analysisDate);

                resolve(response.data.component);
            }).catch((error) => {
                /**
                 * Does not throw an application error because the api/component/show web-api changed in version 6.4
                 * and we currently support SQ versions > 6.3.
                 */
                reject(error.response.data);
            });
        });
    }

}