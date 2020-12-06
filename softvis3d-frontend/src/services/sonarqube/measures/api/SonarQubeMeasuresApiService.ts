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
import {injectable} from "inversify";
import {AppConfiguration} from "../../../../classes/AppConfiguration";
import AppStatusStore from "../../../../stores/AppStatusStore";
import {BackendService} from "../../BackendService";
import SonarQubeMeasuresService from "../SonarQubeMeasuresService";
import {
    SonarQubeMeasurePagingResponse,
    SonarQubeMeasureResponse,
    SQ_QUALIFIER_DIRECTORY,
    SQ_QUALIFIER_FILE,
    SQ_QUALIFIER_UNIT_TEST_FILE
} from "./SonarQubeMeasureResponse";

@injectable()
export default class SonarQubeMeasuresApiService extends BackendService {

    constructor(config: AppConfiguration) {
        super(config.baseUrl);
    }

    public loadMeasures(appStatusStore: AppStatusStore, baseComponentKey: string, metricKeys: string,
                        pageMax = 1, pageCurrent = 1): Promise<SonarQubeMeasureResponse> {

        appStatusStore.loadStatusUpdate(SonarQubeMeasuresService.LOAD_MEASURES.key, pageMax, pageCurrent);

        const qualifiers = Array.from([SQ_QUALIFIER_DIRECTORY, SQ_QUALIFIER_FILE, SQ_QUALIFIER_UNIT_TEST_FILE]).join(",");

        return new Promise<SonarQubeMeasureResponse>((resolve, reject) => {
            const params = {
                baseComponentKey,
                p: pageCurrent,
                metricKeys,
                qualifiers,
                s: "path",
                ps: 500
            };

            this.callApi("/measures/component_tree", {params}).then((response) => {
                const result: SonarQubeMeasurePagingResponse = response.data;
                const allResults: SonarQubeMeasureResponse = {
                    baseComponent: result.baseComponent,
                    components: result.components
                };

                const pagesMax = Math.floor(result.paging.total / result.paging.pageSize) + 1;

                if (result.paging.pageIndex < pagesMax) {
                    return this.loadMeasures(appStatusStore, baseComponentKey, metricKeys, pagesMax, pageCurrent + 1)
                        .then((resultSecond) => {
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