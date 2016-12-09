import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import Category from "../ui/Category";
import SelectBoxBuilder from "../ui/SelectBox/SelectBoxBuilder";

const MetricPropertyPicker: new() => SelectBoxBuilder<Metric> = SelectBoxBuilder as any;

@observer export default class OptionsAdvanced extends React.Component<{ store: CityBuilderStore; }, any> {
    public render() {
        return (
            <Category label="Advanced Options" className="advanced">
                <MetricPropertyPicker
                    label="Metric - Height"
                    value={this.props.store.metricHeight}
                    options={this.props.store.availableMetrics.map((m) => ({key: m.key, label: m.name, value: m}))}
                    onChange={(m: Metric) => { this.props.store.metricHeight = m; }}
                    onMouseDown={() => { this.props.store.chooseEditableProfile(); }}
                    disabled={!this.props.store.profile.editable}
                />
                <MetricPropertyPicker
                    label="Metric - Base"
                    value={this.props.store.metricWidth}
                    options={this.props.store.availableMetrics.map((m) => ({key: m.key, label: m.name, value: m}))}
                    onChange={(m: Metric) => { this.props.store.metricWidth = m; }}
                    onMouseDown={() => { this.props.store.chooseEditableProfile(); }}
                    disabled={!this.props.store.profile.editable}
                />
            </Category>
        );
    }
}