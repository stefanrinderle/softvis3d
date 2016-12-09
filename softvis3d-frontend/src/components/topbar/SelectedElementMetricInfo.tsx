import * as React from "react";
import {observer} from "mobx-react";

@observer
export default class SelectedElementMetricInfo
        extends React.Component<{title: string, name: string, value: number}, any> {

    public render() {
        return <span>{this.props.title} ({this.props.name}): {this.props.value}</span>;
    }

}
