import * as React from "react";
import {RadioButton} from "./RadioButton";

type LocalChangeEvent = (value: any, event: LocalChangeEvent, src: React.Component<any, any>) => void;

interface RadioGroupProps {
    key?: string | number;
    ref?: string | ((component: RadioGroup) => any);

    className?: string;
    disabled?: boolean;
    value?: any;

    onChange: LocalChangeEvent;
}

export class RadioGroup extends React.Component<RadioGroupProps, any> {

    //noinspection JSUnusedGlobalSymbols
    public static defaultProps = {
        className: "",
        disabled: false
    };

    public handleChange(val: any, event: any, context: any): void {
        this.props.onChange(val, event, context);
    }

    public renderChildren(): Array<React.Component<any, any>> {
        return React.Children.map<any>(
            (this.props.children as RadioButton[]),
            (child: React.ReactChild) => {
                if (typeof child === "object" && child.type === RadioButton) {
                    return React.cloneElement(child, {
                        checked: child.props.value.id === this.props.value.id,
                        disabled: this.props.disabled || child.props.disabled,
                        onChange: this.handleChange.bind(this, child.props.value)
                    });
                }

                return child;
            }
        );
    }

    public render() {
        const className = "radio-group " + (this.props.className || "");
        return (
            <div className={className}>
                {this.renderChildren()}
            </div>
        );
    }
}