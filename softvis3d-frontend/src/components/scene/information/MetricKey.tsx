import * as React from "react";
import {observer} from "mobx-react";
import Metric from "../../../classes/Metric";
import {TreeElement} from "../../../classes/TreeElement";
import MetricKeyFormatter from "./MetricKeyFormatter";

interface MetricKeyProps {
    title: string;
    metric: Metric;
    selectedElement: TreeElement | null;
}

@observer
export default class MetricKey extends React.Component<MetricKeyProps, any> {

    public render() {
        const {title, metric, selectedElement} = this.props;

        return (
            <div className="metric-info">
                <span className="title">{title}</span>
                <span className="name">{metric.label}</span>
                {this.renderValue((selectedElement as TreeElement | null), metric)}
            </div>
        );
    }

    private renderValue(element: TreeElement | null, metric: Metric) {
        if (element !== null) {
            let value = MetricKeyFormatter.formatMeasureValue(metric, element.measures[metric.id]);
            return <span className="value">{value}</span>;
        }
    }

}
