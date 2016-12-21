import * as React from "react";
import {observer} from "mobx-react";

@observer
export default class BottomBarMetricInfo extends React.Component<{ title: string; metric: Metric; }, any> {

    public render() {
        return (
            <div className="metric-info">
                <span className="title">{this.props.title}</span>
                <span className="name">{this.props.metric.name}</span>
            </div>
        );
    }

}
