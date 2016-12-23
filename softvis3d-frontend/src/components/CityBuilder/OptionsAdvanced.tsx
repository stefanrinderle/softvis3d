import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import Category from "../ui/Category";
import SelectBoxBuilder from "../ui/SelectBox/SelectBoxBuilder";
import LayoutProcessor from "../../legacy/layoutProcessor";

const StringValuePicker: new() => SelectBoxBuilder<string> = SelectBoxBuilder as any;
const MetricPropertyPicker: new() => SelectBoxBuilder<Metric> = SelectBoxBuilder as any;

@observer export default class OptionsAdvanced extends React.Component<{ store: CityBuilderStore; }, any> {
    public render() {
        return (
            <Category label="Advanced Options" className="advanced" toggle={true}>
                <MetricPropertyPicker
                    label="Metric - Height"
                    value={this.props.store.metricHeight}
                    options={this.props.store.availableGenericMetrics.map((m) => ({key: m.key, label: m.name, value: m}))}
                    onChange={(m: Metric) => { this.props.store.metricHeight = m; }}
                    onMouseDown={() => { this.props.store.chooseEditableProfile(); }}
                    disabled={!this.props.store.profile.editable}
                />
                <MetricPropertyPicker
                    label="Metric - Base"
                    value={this.props.store.metricWidth}
                    options={this.props.store.availableGenericMetrics.map((m) => ({key: m.key, label: m.name, value: m}))}
                    onChange={(m: Metric) => { this.props.store.metricWidth = m; }}
                    onMouseDown={() => { this.props.store.chooseEditableProfile(); }}
                    disabled={!this.props.store.profile.editable}
                />
                <StringValuePicker
                    label="Scaling Method"
                    value={this.props.store.scalingMethod}
                    options={LayoutProcessor.SCALING_METHODS.map((s) => Object.assign({value: s.key}, s))}
                    onChange={(scaling: string) => { this.props.store.scalingMethod = scaling; }}
                />
            </Category>
        );
    }
}