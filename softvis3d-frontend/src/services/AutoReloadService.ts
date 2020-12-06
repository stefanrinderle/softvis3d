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

import {injectable} from "inversify";
import {isUndefined} from "util";
import {lazyInject} from "../inversify.config";
import AppStatusStore from "../stores/AppStatusStore";
import SonarQubeComponentInfoService from "./sonarqube/SonarQubeComponentInfoService";

@injectable()
export default class AutoReloadService {

    // 5 minutes
    public static RELOAD_INTERVAL_MS = 5 * 60 * 1000;

    @lazyInject("SonarQubeComponentInfoService")
    private readonly componentInfoService!: SonarQubeComponentInfoService;
    private timer?: number;

    public startAutoReload(appStatusStore: AppStatusStore): void {
        if (this.timer) {
            window.clearInterval(this.timer);
        }

        // only start the timer if the analysisDate value is available.
        if (!isUndefined(appStatusStore.analysisDate)) {
            this.timer = window.setInterval(this.updateAnalysisDate.bind(this), AutoReloadService.RELOAD_INTERVAL_MS);
        }
    }

    public isActive(): boolean {
        return !isUndefined(this.timer);
    }

    public updateAnalysisDate(appStatusStore: AppStatusStore) {
        this.componentInfoService.loadComponentInfo().then((result) => {
            if (!appStatusStore.analysisDate || appStatusStore.analysisDate.getTime() !== result.analysisDate.getTime()) {
                appStatusStore.analysisDate = result.analysisDate;
            }
        });
    }
}