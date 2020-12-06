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

import {observable} from "mobx";
import {CityBuilderTab} from "../classes/CityBuilderTab";
import Metric from "../classes/Metric";
import MetricSet from "../classes/MetricSet";
import {PreviewPicture} from "../classes/PreviewPicture";
import Profile from "../classes/Profile";
import VisualizationOptions from "../classes/VisualizationOptions";
import {ColorMetrics} from "../constants/Metrics";
import {availablePreviewPictures, placeholder} from "../constants/PreviewPictures";
import {custom, Profiles} from "../constants/Profiles";

export default class CityBuilderStore {

    @observable
    public options: VisualizationOptions = VisualizationOptions.createDefault();

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

    private _customProfile: Profile = custom;

    public setProfile(p: Profile) {
        if (p.id === custom.id) {
            this._customProfile.updateConfiguration(
                this.options.profile.footprintMetric, this.options.profile.heightMetric, this.options.profile.scale);
            this.options.profile = this._customProfile;
        } else {
            this.options.profile = Profiles.getAvailableProfileById(p.id).clone();
        }
    }

    get heightMetric(): Metric {
        return this.options.profile.heightMetric;
    }

    get footprintMetric(): Metric {
        return this.options.profile.footprintMetric;
    }

    public getPreviewBackground(): PreviewPicture {
        for (const preview of availablePreviewPictures) {
            if (preview.forLayout(this.options.layout) && preview.forProfile(this.options.profile)) {
                return preview;
            }
        }

        return placeholder;
    }
}