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
import Metric from "../../../classes/Metric";
import MetricSet from "../../../classes/MetricSet";
import { TreeElement } from "../../../classes/TreeElement";
import VisualizationOptionStore from "../../../stores/VisualizationOptionStore";
import { ColorMetrics } from "../../../constants/ColorMetrics";
import { lazyInject } from "../../../inversify.config";
import SelectedElementService from "../../../services/SelectedElementService";
import SelectBoxBuilder from "../../ui/selectbox/SelectBoxBuilder";
import MetricKey from "./MetricKey";

/**
 * Bottom bar with information about the current selected metrics.
 */
@observer
export default class SceneInformation extends React.Component<Record<string, unknown>, any> {
    @lazyInject("SelectedElementService")
    private readonly selectedElementService!: SelectedElementService;
    @lazyInject("VisualizationOptionStore")
    private readonly visualizationOptions!: VisualizationOptionStore;

    public render() {
        const selectedElement = this.selectedElementService.getSelectedElement();

        return (
            <div className="scene-information">
                <MetricKey
                    title="Footprint"
                    metric={this.visualizationOptions.profile.footprintMetric}
                    selectedElement={selectedElement}
                />
                <MetricKey
                    title="Height"
                    metric={this.visualizationOptions.profile.heightMetric}
                    selectedElement={selectedElement}
                />
                <SelectBoxBuilder
                    label="Color"
                    className="metric-info"
                    value={this.visualizationOptions.metricColor}
                    options={new MetricSet(ColorMetrics.availableColorMetrics).asSelectOptions}
                    onChange={(m: Metric) => {
                        this.visualizationOptions.metricColor = m;
                    }}
                    append={this.renderColorInformation(selectedElement)}
                />
            </div>
        );
    }

    private renderColorInformation(selectedElement: TreeElement | null): JSX.Element[] {
        const colorInformation: JSX.Element[] = [];
        if (selectedElement !== null) {
            const colorValue = selectedElement.getMeasureValue(
                this.visualizationOptions.metricColor
            );
            if (colorValue !== null) {
                colorInformation.push(<span className="value">{colorValue}</span>);
            }
        }
        return colorInformation;
    }
}
