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



import {observer} from "mobx-react";
import * as React from "react";
import Metric from "../../classes/Metric";
import Profile from "../../classes/Profile";
import {Layouts} from "../../constants/Layouts";
import {Profiles} from "../../constants/Profiles";
import CityBuilderStore from "../../stores/CityBuilderStore";
import SelectBoxBuilder from "../ui/selectbox/SelectBoxBuilder";
import LayoutPicker from "./LayoutPicker";
import PreviewPictureComponent from "./PreviewPictureComponent";

export interface OptionsSimpleProps {
    store: CityBuilderStore;
    baseUrl?: string;
}

@observer
export default class OptionsSimple extends React.Component<OptionsSimpleProps, any> {
    public render() {

        const {options} = this.props.store;

        return (
            <div className="simple">
                <div className="left-column">
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Profile"
                            className="profiles"
                            value={this.props.store.options.profile}
                            options={Profiles.availableProfiles}
                            onChange={(p: any) => { this.props.store.options.profile = (p as Profile); }}
                        />
                        <p className="selection-description profile-description">
                            {this.props.store.options.profile.description}
                        </p>
                    </div>
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Building Color"
                            className="metric color"
                            value={options.metricColor}
                            options={this.props.store.colorMetrics.asSelectOptions}
                            onChange={(m: any) => { options.metricColor = (m as Metric); }}
                        />
                        <p className="selection-description color-description">
                            { options.metricColor.description }
                        </p>
                    </div>

                    <div className="builder-option">
                        <span>Layout</span>
                        <LayoutPicker
                            layouts={Layouts.availableLayouts}
                            store={this.props.store}
                        />
                        <p className="selection-description layout-description">
                            {options.layout.description}
                        </p>
                    </div>
                </div>
                <div className="right-column">
                    <PreviewPictureComponent store={this.props.store} baseUrl={this.props.baseUrl}/>
                </div>
            </div>
        );
    }
}