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
import { AppStatusStore } from "../../stores/AppStatusStore";
import ErrorAction from "../../classes/status/ErrorAction";

export interface SonarQubeComponentInfo {
    id: number;
    key: string;
    name: string;
    analysisDate: Date;
}

export default class SonarQubeComponentInfoService extends BackendService {
    private static LOAD_COMPONENT_INFO_ERROR_KEY: string = "LOAD_COMPONENT_INFO_ERROR";

    private appStatusStore: AppStatusStore;
    private projectKey: string;

    constructor(projectKey: string, appStatusStore: AppStatusStore, baseUrl?: string) {
        super(baseUrl);

        this.projectKey = projectKey;
        this.appStatusStore = appStatusStore;
    }

    public loadComponentInfo(): Promise<SonarQubeComponentInfo> {
        return new Promise<SonarQubeComponentInfo>((resolve, reject) => {
            const params = {component: this.projectKey};
            this.callApi("/components/show", {params}).then((response) => {

                response.data.component.analysisDate = new Date(response.data.component.analysisDate);

                resolve(response.data.component);
            }).catch((error) => {
                this.appStatusStore.error(
                    new ErrorAction(SonarQubeComponentInfoService.LOAD_COMPONENT_INFO_ERROR_KEY,
                        "SonarQube component API is not available or responding: ",
                        "Try again", () => {
                            location.reload();
                        }));
                reject(error.message);
            });
        });
    }

}