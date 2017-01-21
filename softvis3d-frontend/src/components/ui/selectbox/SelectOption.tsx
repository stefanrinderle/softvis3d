import * as React from "react";

interface SelectOptionProps {
    checked?: boolean;
    disabled?: boolean;
    selectOptionElement: SelectOptionValue;
}

export default class SelectOption extends React.Component<SelectOptionProps, any> {
    public static defaultProps = {
        defaultChecked: false,
        disabled: false
    };

    public render() {
        return (
            <option
                value={JSON.stringify(this.props.selectOptionElement)}
                checked={this.props.checked}
                disabled={this.props.disabled}
            >
                {this.props.selectOptionElement.getLabel()}
            </option>
        );
    }
}