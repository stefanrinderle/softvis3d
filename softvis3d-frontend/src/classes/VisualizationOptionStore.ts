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

import { Type } from "class-transformer";
import { observable } from "mobx";
import { DEFAULT_BUILDING_COLOR_THEME } from "../constants/BuildingColorThemes";
import { evostreet } from "../constants/Layouts";
import { noColorMetric } from "../constants/Metrics";
import { custom, defaultProfile } from "../constants/Profiles";
import { DEFAULT_COLOR_THEME } from "../constants/SceneColorThemes";
import BuildingColorTheme from "./BuildingColorTheme";
import FileFilter from "./FileFilter";
import Layout from "./Layout";
import Metric from "./Metric";
import Profile from "./Profile";
import { SceneColorTheme } from "./SceneColorTheme";

export default class VisualizationOptionStore {
    public static createDefault(): VisualizationOptionStore {
        return new VisualizationOptionStore(
            defaultProfile.clone(),
            evostreet,
            noColorMetric,
            DEFAULT_BUILDING_COLOR_THEME,
            DEFAULT_COLOR_THEME,
            new FileFilter()
        );
    }

    @Type(() => Profile)
    @observable
    public profile: Profile;
    @Type(() => Layout)
    @observable
    public layout: Layout;
    @Type(() => Metric)
    @observable
    public metricColor: Metric;
    @Type(() => BuildingColorTheme)
    @observable
    public buildingColorTheme: BuildingColorTheme;
    @Type(() => SceneColorTheme)
    @observable
    public colorTheme: SceneColorTheme;
    @Type(() => FileFilter)
    public fileFilter: FileFilter;

    constructor(
        profile: Profile,
        layout: Layout,
        metricColor: Metric,
        buildingColorTheme: BuildingColorTheme,
        colorTheme: SceneColorTheme,
        fileFilter: FileFilter
    ) {
        this.profile = profile;
        this.layout = layout;
        this.metricColor = metricColor;
        this.buildingColorTheme = buildingColorTheme;
        this.colorTheme = colorTheme;
        this.fileFilter = fileFilter;
    }

    setProfile(p: Profile) {
        if (p.id === custom.id) {
            this.updateCustomProfile();
            this.profile = custom;
        } else {
            this.profile = p;
        }
    }

    public setCustomHeightMetric(metric: Metric) {
        this.updateCustomProfile();
        custom.heightMetric = metric;
        this.profile = custom;
    }

    public setCustomFootprintMetric(metric: Metric) {
        this.updateCustomProfile();
        custom.footprintMetric = metric;
        this.profile = custom;
    }

    private updateCustomProfile() {
        custom.updateConfiguration(
            this.profile.footprintMetric,
            this.profile.heightMetric,
            this.profile.scale
        );
    }

    public equalStructure(candidate: VisualizationOptionStore | null): boolean {
        if (candidate) {
            return (
                this.layout.id === candidate.layout.id &&
                this.profile.footprintMetric === candidate.profile.footprintMetric &&
                this.profile.heightMetric === candidate.profile.heightMetric &&
                this.profile.scale === candidate.profile.scale
            );
        } else {
            return false;
        }
    }
}
