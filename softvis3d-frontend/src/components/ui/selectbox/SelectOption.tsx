import * as React from "react";

interface SelectOptionProps {
    checked?: boolean;
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
                checked={this.props.checked}
                disabled={this.props.disabled}
            >
                {this.props.value.label}
            </option>
        );
    }
}