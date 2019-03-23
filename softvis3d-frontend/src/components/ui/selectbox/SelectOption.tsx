import * as React from "react";

interface SelectOptionProps {
    selected?: boolean;
    disabled?: boolean;
    value: SelectOptionValue;
}

export default class SelectOption extends React.Component<SelectOptionProps, any> {
    public static defaultProps = {
        defaultChecked: false,
        disabled: false
    };

    public render() {
        return (
            <option
                value={this.props.value.id}
                selected={this.props.selected}
                disabled={this.props.disabled}
            >
                {this.props.value.label}
            </option>
        );
    }
}