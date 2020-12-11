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
import Metric from "../../classes/Metric";
import Profile from "../../classes/Profile";
import VisualizationOptionStore from "../../classes/VisualizationOptionStore";
import { Layouts } from "../../constants/Layouts";
import { getPreviewBackground } from "../../constants/PreviewPictures";
import { Profiles } from "../../constants/Profiles";
import { lazyInject } from "../../inversify.config";
import CityBuilderStore from "../../stores/CityBuilderStore";
import SelectBoxBuilder from "../ui/selectbox/SelectBoxBuilder";
import LayoutPicker from "./LayoutPicker";
import PreviewPictureComponent from "./PreviewPictureComponent";

export interface OptionsSimpleProps {
    baseUrl?: string;
}

@observer
export default class OptionsSimple extends React.Component<OptionsSimpleProps, any> {
    @lazyInject("VisualizationOptionStore")
    private readonly visualizationOptions!: VisualizationOptionStore;
    @lazyInject("CityBuilderStore")
    private readonly cityBuilderStore!: CityBuilderStore;

    public render() {
        // TODO remove colorMetrics from cityBuilderStore and access directly.
        const { colorMetrics } = this.cityBuilderStore;

        return (
            <div className="simple">
                <div className="left-column">
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Profile"
                            className="profiles"
                            value={this.visualizationOptions.profile}
                            options={Profiles.availableProfiles}
                            onChange={(p: Profile) => {
                                this.visualizationOptions.setProfile(p);
                            }}
                        />
                        <p className="selection-description profile-description">
                            {this.visualizationOptions.profile.description}
                        </p>
                    </div>
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Building Color"
                            className="metric color"
                            value={this.visualizationOptions.metricColor}
                            options={colorMetrics.asSelectOptions}
                            onChange={(m: Metric) => {
                                this.visualizationOptions.metricColor = m;
                            }}
                        />
                        <p className="selection-description color-description">
                            {this.visualizationOptions.metricColor.description}
                        </p>
                    </div>

                    <div className="builder-option">
                        <span>Layout</span>
                        <LayoutPicker layouts={Layouts.availableLayouts} />
                        <p className="selection-description layout-description">
                            {this.visualizationOptions.layout.description}
                        </p>
                    </div>
                </div>
                <div className="right-column">
                    <PreviewPictureComponent
                        previewPicture={getPreviewBackground(
                            this.visualizationOptions.layout,
                            this.visualizationOptions.profile
                        )}
                        baseUrl={this.props.baseUrl}
                    />
                </div>
            </div>
        );
    }
}
