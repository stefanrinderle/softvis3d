import * as React from "react";
import {SelectBox, SelectOption} from "../ui/SelectBox";

interface KeyLabelInterface {
    key: string;
    name: string;
}

export interface PropertyPickerProps<T extends KeyLabelInterface> {
    label: string;
    value: T;
    options: T[];
    onChange: (value: T) => void|boolean;
    onMouseDown: () => void|boolean;
    disabled: boolean;
}

export default class PropertyPicker<T extends KeyLabelInterface> extends React.Component<PropertyPickerProps<T>, any> {
    public render() {
        return (
            <div className="property-component">
                <SelectBox
                    label={this.props.label}
                    onMouseDown={this.props.onMouseDown}
                    onChange={this.props.onChange}
                    value={this.props.value}
                >
                    {this.createOptionsFromLoadedMetrics()}
                </SelectBox>
            </div>
        );
    }

    private createOptionsFromLoadedMetrics() {
        return this.props.options
            .map((metric) => <SelectOption
                key={metric.key}
                value={metric}
                label={metric.name}
                disabled={this.props.disabled}
            />);
    }
}