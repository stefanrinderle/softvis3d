import * as React from "react";
import {observer} from "mobx-react";
import Metric from "../../../classes/Metric";

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
                <span className="name">{metric.name}</span>
                {this.renderValue((selectedElement as TreeElement|null), metric)}
            </div>
        );
    }

    private renderValue(element: TreeElement|null, metric: Metric) {
        if (element !== null && element.children.length === 0) {
            return <span className="value">{element.measures[metric.id] || 0}</span>;
        }
    }

}
