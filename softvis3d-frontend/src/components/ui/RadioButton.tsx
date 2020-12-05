import * as React from "react";
import {ChangeEvent} from "react";

type BoundChangeEvent = (event: ChangeEvent<HTMLInputElement>, src: React.Component<any, any>) => void;

interface RadioButtonProps {
    checked?: boolean;
    disabled?: boolean;
    onChange?: BoundChangeEvent;
    className?: string;
    activeClass?: string;
    value: any;
    label: string;
}

export class RadioButton extends React.Component<RadioButtonProps, any> {

    //noinspection JSUnusedGlobalSymbols
    public static defaultProps = {
        className: "",
        activeClass: "active",
        disabled: false
    };

    public handleClick(event: ChangeEvent<HTMLInputElement>): void {
        if (!this.props.disabled && this.props.onChange) {
            this.props.onChange(event, this);
        }
    }

    public render() {
        let className = this.props.className;
        className += this.props.checked ? " " + this.props.activeClass : "";
        return (
            <label className={className} id={"select-" + this.props.value.id}>
                <input
                    type={"radio"}
                    checked={this.props.checked}
                    onChange={this.handleClick.bind(this)}
                />
                {this.props.label}
            </label>
        );
    }
}