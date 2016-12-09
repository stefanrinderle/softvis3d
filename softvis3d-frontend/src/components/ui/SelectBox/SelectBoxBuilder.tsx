import * as React from "react";
import SelectBox from "./SelectBox";
import SelectOption from "./SelectOption";

export interface SelectBoxBuilderProps<T> {
    className?: string;
    label: string;
    value: T;
    options: Array<{ key: string; label: string; value: T; }>;
    onChange: (value: T) => void|boolean;
    onClick?: (event: React.SyntheticEvent) => void|boolean;
    onMouseDown?: (event: React.SyntheticEvent) => void|boolean;
    disabled?: boolean;
}

export default class SelectBoxBuilder<T> extends React.Component<SelectBoxBuilderProps<T>, any> {
    public render() {
        return (
            <SelectBox
                className={this.props.className}
                label={this.props.label}
                onMouseDown={this.props.onMouseDown}
                onClick={this.props.onClick}
                onChange={this.props.onChange}
                value={this.props.value}
            >
                {this.getSelectOptions()}
            </SelectBox>
        );
    }

    private getSelectOptions() {
        return this.props.options
            .map((o) => <SelectOption
                key={o.key}
                value={o.value}
                label={o.label}
                disabled={this.props.disabled}
            />);
    }
}
