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

import { observable } from "mobx";
import { CityBuilderTab } from "../classes/CityBuilderTab";
import MetricSet from "../classes/MetricSet";
import { ColorMetrics } from "../constants/ColorMetrics";
import VisualizationOptionStore from "./VisualizationOptionStore";

export default class CityBuilderStore {
    @observable
    public options: VisualizationOptionStore = VisualizationOptionStore.createDefault();

    @observable
    public readonly colorMetrics: MetricSet = new MetricSet(ColorMetrics.availableColorMetrics);
    @observable
    public readonly genericMetrics: MetricSet = new MetricSet([]);
    @observable
    public initiateBuildProcess = false;
    @observable
    public show = true;
    @observable
    public currentTab: CityBuilderTab = CityBuilderTab.Default;
}
