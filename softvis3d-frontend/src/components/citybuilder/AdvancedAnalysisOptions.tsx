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

import { observer } from "mobx-react";
import * as React from "react";
import BuildingColorTheme from "../../classes/BuildingColorTheme";
import Layout from "../../classes/Layout";
import Metric from "../../classes/Metric";
import Scale from "../../classes/Scale";
import { SceneColorTheme } from "../../classes/SceneColorTheme";
import { TestClassesVariant } from "../../classes/TestClassesVariant";
import { BuildingColorThemes } from "../../constants/BuildingColorThemes";
import { Layouts } from "../../constants/Layouts";
import { custom } from "../../constants/Profiles";
import { Scales } from "../../constants/Scales";
import { SceneColorThemes } from "../../constants/SceneColorThemes";
import { TestClassesVariants } from "../../constants/TestClassesVariants";
import { lazyInject } from "../../inversify.config";
import CityBuilderStore from "../../stores/CityBuilderStore";
import Category from "../ui/Category";
import SelectBoxBuilder from "../ui/selectbox/SelectBoxBuilder";
import { TextInput } from "../ui/TextInput";

@observer
export default class AdvancedAnalysisOptions extends React.Component<Record<string, never>, any> {
    @lazyInject("CityBuilderStore")
    private readonly cityBuilderStore!: CityBuilderStore;

    public render() {
        const { footprintMetric, heightMetric, options } = this.cityBuilderStore;

        return (
            <div>
                <Category
                    label="Metrics"
                    className="advanced"
                    toggle={false}
                    initialVisibility={true}
                >
                    <div className="left-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Metric - Footprint"
                                value={footprintMetric}
                                options={this.cityBuilderStore.genericMetrics.asSelectOptions}
                                onChange={(m: Metric) => {
                                    this.cityBuilderStore.setProfile(custom);
                                    this.cityBuilderStore.options.profile.footprintMetric = m;
                                }}
                            />
                            <p className="selection-description">{footprintMetric.description}</p>
                        </div>
                    </div>
                    <div className="middle-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Metric - Height"
                                value={heightMetric}
                                options={this.cityBuilderStore.genericMetrics.asSelectOptions}
                                onChange={(m: Metric) => {
                                    this.cityBuilderStore.setProfile(custom);
                                    this.cityBuilderStore.options.profile.heightMetric = m;
                                }}
                            />
                            <p className="selection-description">{heightMetric.description}</p>
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Building color metric"
                                className="metric color"
                                value={options.metricColor}
                                options={this.cityBuilderStore.colorMetrics.asSelectOptions}
                                onChange={(m: any) => {
                                    options.metricColor = m as Metric;
                                }}
                            />
                            <p className="selection-description color-description">
                                {options.metricColor.description}
                            </p>
                        </div>
                    </div>
                </Category>
                <Category
                    label="Color themes"
                    className="advanced"
                    toggle={false}
                    initialVisibility={true}
                >
                    <div className="left-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Base color theme"
                                value={options.colorTheme}
                                options={SceneColorThemes.availableColorThemes}
                                onChange={(colorTheme: SceneColorTheme) => {
                                    options.colorTheme = colorTheme;
                                }}
                            />
                        </div>
                    </div>
                    <div className="middle-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Building color theme"
                                value={options.buildingColorTheme}
                                options={BuildingColorThemes.availableBuildingColorThemes}
                                onChange={(buildingColorTheme: BuildingColorTheme) => {
                                    options.buildingColorTheme = buildingColorTheme;
                                }}
                            />
                        </div>
                    </div>
                </Category>
                <Category
                    label="Layout"
                    className="advanced"
                    toggle={false}
                    initialVisibility={true}
                >
                    <div className="left-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Layout"
                                value={options.layout}
                                options={Layouts.availableLayouts}
                                onChange={(layout: Layout) => {
                                    options.layout = layout;
                                }}
                            />
                            <p className="selection-description">{options.layout.description}</p>
                        </div>
                    </div>
                    <div className="middle-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Scaling Method"
                                value={this.cityBuilderStore.options.profile.scale}
                                options={Scales.availableScales}
                                onChange={(scale: Scale) => {
                                    this.cityBuilderStore.options.profile.scale = scale;
                                }}
                            />
                            <p className="selection-description">
                                {this.cityBuilderStore.options.profile.scale.description}
                            </p>
                        </div>
                    </div>
                </Category>
                <Category
                    label="Files"
                    className="advanced"
                    toggle={false}
                    initialVisibility={true}
                >
                    <div className="left-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Test classes"
                                value={this.cityBuilderStore.options.fileFilter.testClassesVariant}
                                options={TestClassesVariants.availableTestClassesVariants}
                                onChange={(testClassesVariant: TestClassesVariant) => {
                                    this.cityBuilderStore.options.fileFilter.testClassesVariant = testClassesVariant;
                                }}
                            />
                        </div>
                    </div>
                    <div className="middle-column">
                        <div className="builder-option">
                            <TextInput
                                id="excludeClasses"
                                label="Exclude classes regex"
                                value={
                                    this.cityBuilderStore.options.fileFilter.excludeClasses.value
                                }
                                onChange={(event) => {
                                    this.cityBuilderStore.options.fileFilter.excludeClasses.value =
                                        event.target.value;
                                }}
                            />
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="builder-option">
                            <TextInput
                                id="includeClasses"
                                label="Include classes regex"
                                value={
                                    this.cityBuilderStore.options.fileFilter.includeClasses.value
                                }
                                onChange={(event) => {
                                    this.cityBuilderStore.options.fileFilter.includeClasses.value =
                                        event.target.value;
                                }}
                            />
                        </div>
                    </div>
                </Category>
            </div>
        );
    }
}
