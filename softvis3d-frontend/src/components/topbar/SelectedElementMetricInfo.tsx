import * as React from "react";
import {observer} from "mobx-react";

interface SelectedElementMetricInfoProp {
    title: string;
    name: string;
    value: number;
}

@observer export default class SelectedElementMetricInfo extends React.Component<SelectedElementMetricInfoProp, any> {
    public render() {
        return (
            <div className="metric-info">
                <span className="title">{this.props.title}</span>
                <span className="name">{this.props.name}</span>
                <span className="value">{this.props.value}</span>
            </div>
        );
    }
}
