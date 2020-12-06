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
import Metric from "../../../classes/Metric";
import { TreeElement } from "../../../classes/TreeElement";
import MetricKeyFormatter from "./MetricKeyFormatter";

interface MetricKeyProps {
    title: string;
    metric: Metric;
    selectedElement: TreeElement | null;
}

@observer
export default class MetricKey extends React.Component<MetricKeyProps, any> {
    public render() {
        const { title, metric, selectedElement } = this.props;

        return (
            <div className="metric-info">
                <span className="title">{title}</span>
                <span className="name">{metric.label}</span>
                {this.renderValue(selectedElement, metric)}
            </div>
        );
    }

    private renderValue(element: TreeElement | null, metric: Metric) {
        if (element !== null) {
            const value = MetricKeyFormatter.formatMeasureValue(
                metric,
                element.measures[metric.id]
            );
            return <span className="value">{value}</span>;
        }
    }
}
