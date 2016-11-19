import * as React from "react";

type BoundChangeEvent = (event: React.SyntheticEvent, src: React.Component<any, any>) => void;
type ChangeEvent = (value: any, event: React.SyntheticEvent, src: React.Component<any, any>) => void;

interface RadioGroupProps {
    children?: RadioButton[];
    key?: string | number;
    ref?: string | ((component: RadioGroup) => any);

    className?: string;
    disabled?: boolean;
    value?: any;

    onChange: ChangeEvent;
}

export class RadioGroup extends React.Component<RadioGroupProps, any> {

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
            (child: React.ReactElement<any>) => {
                if (child.type === RadioButton) {
                    return React.cloneElement(child, {
                        checked: child.props.value === this.props.value,
                        disabled: this.props.disabled || child.props.disabled,
                        onChange: this.handleChange.bind(this, child.props.value)
                    });
                } else {
                    return child;
                }
            }
        );
    }

    public render() {
        return (
            <div className={this.props.className}>
                {this.renderChildren()}
            </div>
        );
    }
}

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
    public static defaultProps = {
        className: "",
        activeClass: "active",
        disabled: false
    };

    public handleClick(event: React.SyntheticEvent): void {
        if (!this.props.disabled && this.props.onChange) {
            this.props.onChange(event, this);
        }
    }

    public render() {
        let className = this.props.className;
        className += this.props.checked ? " " + this.props.activeClass : "";
        return (
            <label className={className}>
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
