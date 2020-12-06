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

import {TreeElement} from "../../../../classes/TreeElement";
import {lazyInject} from "../../../../inversify.config";
import AppStatusStore from "../../../../stores/AppStatusStore";
import SonarQubeMeasuresApiService from "./SonarQubeMeasuresApiService";
import SonarQubeTransformerService from "./SonarQubeTransformerService";

export default class SonarQubeMeasuresTreeService {

    @lazyInject("SonarQubeMeasuresApiService")
    private readonly measureApiService!: SonarQubeMeasuresApiService;
    @lazyInject("SonarQubeTransformerService")
    private readonly sonarQubeTransformerService!: SonarQubeTransformerService;

    public loadTree(appStatusStore: AppStatusStore, parent: TreeElement, metricKeys: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.measureApiService.loadMeasures(appStatusStore, parent.key, metricKeys).then((result) => {
                for (const file of result.components) {
                    const element = this.sonarQubeTransformerService.createTreeElement(file);
                    this.sonarQubeTransformerService.add(parent, element, true);
                }
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

}