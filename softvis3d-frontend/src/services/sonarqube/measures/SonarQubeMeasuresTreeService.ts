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
import {TreeElement} from "../../../classes/TreeElement";
import {lazyInject} from "../../../inversify.config";
import SonarQubeTransformer from "../SonarQubeTransformer";
import SonarQubeMeasuresApiService from "./SonarQubeMeasuresApiService";

export default class SonarQubeMeasuresTreeService {

    @lazyInject("SonarQubeMeasuresApiService")
    private measureApiService!: SonarQubeMeasuresApiService;

    public loadTree(parent: TreeElement, metricKeys: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.measureApiService.loadMeasures(parent.key, metricKeys).then((result) => {
                for (const file of result.components) {
                    SonarQubeTransformer.add(parent, SonarQubeTransformer.createTreeElement(file), true);
                }
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

}