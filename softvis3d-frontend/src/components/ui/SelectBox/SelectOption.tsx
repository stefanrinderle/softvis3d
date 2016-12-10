import * as React from "react";

interface SelectOptionProps {
    checked?: boolean;
    disabled?: boolean;
    value: any;
    label: string;
}

export default class SelectOption extends React.Component<SelectOptionProps, any> {
    public static defaultProps = {
        defaultChecked: false,
        disabled: false
    };

    public render() {
        return (
            <option
                value={JSON.stringify(this.props.value)}
                checked={this.props.checked}
                disabled={this.props.disabled}
            >
                {this.props.label}
            </option>
        );
    }
}