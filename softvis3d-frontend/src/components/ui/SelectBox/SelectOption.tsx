import * as React from "react";
import {SelectOptionElement} from "./SelectBoxBuilder";

interface SelectOptionProps {
    checked?: boolean;
    disabled?: boolean;
    selectOptionElement: SelectOptionElement<any>;
}

export default class SelectOption extends React.Component<SelectOptionProps, any> {
    public static defaultProps = {
        defaultChecked: false,
        disabled: false
    };

    public render() {
        return (
            <option
                value={JSON.stringify(this.props.selectOptionElement.value)}
                checked={this.props.checked}
                disabled={this.props.disabled}
            >
                {this.props.selectOptionElement.label}
            </option>
        );
    }
}