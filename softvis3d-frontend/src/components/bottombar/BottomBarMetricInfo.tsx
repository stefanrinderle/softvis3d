import * as React from "react";
import {observer} from "mobx-react";

interface BottomBarMetricInfoProps {
    title: string;
    metric: Metric;
}

@observer
export default class BottomBarMetricInfo extends React.Component<BottomBarMetricInfoProps, any> {

    public render() {
        return (
            <div className="metric-info">
                <span className="title">{this.props.title}</span>
                <span className="name">{this.props.metric.name}</span>
            </div>
        );
    }

}
