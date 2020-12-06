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

import * as React from "react";
import { observer } from "mobx-react";
import { lazyInject } from "../../../inversify.config";
import CityBuilderStore from "../../../stores/CityBuilderStore";
import MetricKey from "./MetricKey";
import SceneStore from "../../../stores/SceneStore";
import SelectBoxBuilder from "../../ui/selectbox/SelectBoxBuilder";
import { ColorMetrics } from "../../../constants/Metrics";
import MetricSet from "../../../classes/MetricSet";
import Metric from "../../../classes/Metric";

interface SceneInformationProps {
    sceneStore: SceneStore;
}

/**
 * Bottom bar with information about the current selected metrics.
 */
@observer
export default class SceneInformation extends React.Component<SceneInformationProps, any> {
    @lazyInject("CityBuilderStore")
    private readonly cityBuilderStore!: CityBuilderStore;

    public render() {
        const { sceneStore } = this.props;
        const selectedElement = sceneStore.selectedElement;

        return (
            <div className="scene-information">
                <MetricKey
                    title="Footprint"
                    metric={this.cityBuilderStore.options.profile.footprintMetric}
                    selectedElement={selectedElement}
                />
                <MetricKey
                    title="Height"
                    metric={this.cityBuilderStore.options.profile.heightMetric}
                    selectedElement={selectedElement}
                />
                <SelectBoxBuilder
                    label="Color"
                    className="metric-info"
                    value={this.cityBuilderStore.options.metricColor}
                    options={new MetricSet(ColorMetrics.availableColorMetrics).asSelectOptions}
                    onChange={(m: Metric) => {
                        this.cityBuilderStore.options.metricColor = m;
                    }}
                    append={this.renderColorInformation()}
                />
            </div>
        );
    }

    private renderColorInformation(): JSX.Element[] {
        const colorValue = this.props.sceneStore.getColorValue(
            this.cityBuilderStore.options.metricColor
        );
        const colorInformation: JSX.Element[] = [];
        if (colorValue !== null) {
            colorInformation.push(<span className="value">{colorValue}</span>);
        }
        return colorInformation;
    }
}
