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
import {BackendService} from "../BackendService";
import {SonarQubeMeasurePagingResponse, SonarQubeMeasureResponse, SonarQubeQualifier} from "./SonarQubeMeasureResponse";
import {AppConfiguration} from "../../../classes/AppConfiguration";

export default class SonarQubeMeasuresApiService extends BackendService {

    constructor(config: AppConfiguration) {
        super(config.baseUrl);
    }

    public loadMeasures(baseComponentKey: string, metricKeys: string, strategy: string, qualifiers: SonarQubeQualifier[],
                        page: number = 1): Promise<SonarQubeMeasureResponse> {
        return new Promise<SonarQubeMeasureResponse>((resolve, reject) => {
            const params = {
                baseComponentKey,
                p: page,
                metricKeys,
                strategy,
                qualifiers: Array.from(qualifiers).join(","),
                s: "path",
                ps: 500
            };

            this.callApi("/measures/component_tree", {params}).then((response) => {
                let result: SonarQubeMeasurePagingResponse = response.data;
                let allResults: SonarQubeMeasureResponse = {
                    baseComponent: result.baseComponent,
                    components: result.components
                };

                const position = result.paging.pageIndex * result.paging.pageSize;
                if (position < result.paging.total) {
                    return this.loadMeasures(baseComponentKey, metricKeys, strategy, qualifiers, page + 1).then((resultSecond) => {
                        allResults.components = allResults.components.concat(resultSecond.components);
                        resolve(allResults);
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    resolve(allResults);
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

}