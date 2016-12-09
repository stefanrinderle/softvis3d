import * as React from "react";
import {observer} from "mobx-react";

@observer
export default class BottomBarMetricInfo extends React.Component<{ title: string; metric: Metric; }, any> {

    public render() {
        return (
            <span>
                {this.props.title}: {this.props.metric.name}
            </span>
        );
    }

}
