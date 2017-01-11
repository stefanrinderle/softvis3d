import * as React from "react";
import SelectOption from "./SelectOption";
import SelectGroup from "./SelectGroup";

type ChangeEvent = (value: any, event: React.SyntheticEvent, src: React.Component<any, any>) => void|boolean;

interface SelectBoxProps {
    children?: Array<SelectOption|SelectGroup>;

    className?: string;
    disabled?: boolean;
    value?: any;
    label?: string;

    onChange: ChangeEvent;
    onClick?: (event: React.SyntheticEvent) => void|boolean;
    onMouseDown?: (event: React.SyntheticEvent) => void|boolean;
}

export default class SelectBox extends React.Component<SelectBoxProps, any> {
    public static defaultProps = {
        className: "",
        disabled: false
    };

    public handleChange(event: React.SyntheticEvent) {
        const newValue = JSON.parse((event.target as HTMLOptionElement).value);
        this.props.onChange(newValue, event, this);
    }

    public render() {
        const noEvent = () => true;
        const clickEvent = this.props.onClick || noEvent;
        const mouseDownEvent = this.props.onMouseDown || noEvent;
        const className = "selectbox " + (this.props.className || "");

        return (
            <div className={className.trim()}>
                {this.renderLabel()}
                <select
                    disabled={this.props.disabled}
                    className={this.props.className}
                    value={JSON.stringify(this.props.value)}
                    onChange={this.handleChange.bind(this)}
                    onClick={clickEvent}
                    onMouseDown={mouseDownEvent}
                >
                    {this.renderChildren()}
                </select>
            </div>
        );
    }

    private renderLabel() {
        if (!this.props.label) {
            return null;
        }

        return (
            <span>{this.props.label}</span>
        );
    }

    private renderChildren(): Array<React.Component<any, any>> {
        return React.Children.map<any>(
            (this.props.children as Array<SelectOption|SelectGroup>),
            (child: React.ReactElement<any>) => {
                if (child.type === SelectOption) {
                    return React.cloneElement(child, {
                        checked: child.props.value === this.props.value,
                        disabled: this.props.disabled || child.props.disabled
                    });
                } else if (child.type === SelectGroup) {
                    return React.cloneElement(child, {
                        selectedValue: this.props.value,
                        disabled: this.props.disabled || child.props.disabled
                    });
                } else {
                    return child;
                }
            }
        );
    }
}
