import * as React from "react";
import SelectOption from "./SelectOption";
import SelectGroup from "./SelectGroup";

type ChangeEvent = (value: any) => void|boolean;

interface SelectBoxProps {
    children?: Array<SelectOption|SelectGroup>;
    prepend?: JSX.Element[];
    append?: JSX.Element[];

    className?: string;
    disabled?: boolean;
    value: SelectOptionValue;
    label?: string;

    onChange: ChangeEvent;
    onClick?: (event: React.SyntheticEvent) => void|boolean;
    onMouseDown?: (event: React.SyntheticEvent) => void|boolean;
}

export default class SelectBox extends React.Component<SelectBoxProps, any> {
    public static defaultProps = {
        prepend: [],
        append: [],
        className: "",
        disabled: false,
        value: null
    };

    private values: SelectOptionValue[] = [];

    public handleChange(event: React.SyntheticEvent) {
        const value = (event.target as HTMLOptionElement).value;
        const target = this.values.find((o: SelectOptionValue) => o.getValue() === value);

        if (target) {
            this.props.onChange(target);
        }
    }

    public render() {
        const noEvent = () => true;
        const clickEvent = this.props.onClick || noEvent;
        const mouseDownEvent = this.props.onMouseDown || noEvent;
        const className = "selectbox " + (this.props.className || "");

        return (
            <div className={className.trim()}>
                {this.props.prepend}
                {this.renderLabel()}
                <select
                    disabled={this.props.disabled}
                    className={this.props.className}
                    value={this.props.value.getValue()}
                    onChange={this.handleChange.bind(this)}
                    onClick={clickEvent}
                    onMouseDown={mouseDownEvent}
                >
                    {this.renderChildren()}
                </select>
                {this.props.append}
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
        this.values = [];
        return React.Children.map<any>(
            (this.props.children as Array<SelectOption|SelectGroup>),
            (child: React.ReactElement<any>) => {
                if (child.type === SelectOption) {
                    //noinspection JSUnusedGlobalSymbols
                    return React.cloneElement(child, {
                        checked: child.props.value === this.props.value,
                        disabled: this.props.disabled || child.props.disabled,
                        ref: (object: SelectOption | null) => {
                            if (object) {
                                this.values.push(object.props.value);
                            }
                        }
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
