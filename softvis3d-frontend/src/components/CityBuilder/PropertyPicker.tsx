import * as React from "react";
import { observer } from "mobx-react";
import { SelectBox, SelectOption } from "../ui/SelectBox";
import { CityBuilderConfig } from "../../stores/CityBuilder";

export interface PropertyPickerProps {
    store: CityBuilderConfig;
}

@observer export default class PropertyPicker extends React.Component<PropertyPickerProps, any> {
    public handelChange(key: string) {
        this.props.store.metricHeight = key;
    }

    public createOptionsFromLoadedMetrics() {
        return this.props.store.availableMetrics
            .map(metric => <SelectOption key={metric.id} value={metric.key} label={metric.name} />);
    }

    public render() {
        return (
            <SelectBox onChange={this.handelChange.bind(this)} value={this.props.store.metricHeight}>
                {this.createOptionsFromLoadedMetrics()}
            </SelectBox>
        );
    }
}