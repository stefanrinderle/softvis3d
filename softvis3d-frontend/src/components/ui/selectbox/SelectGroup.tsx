import * as React from "react";
import SelectOption from "./SelectOption";

interface SelectGroupProps {
    selectedValue?: any;
    disabled?: boolean;
    label: string;
    optionRef?: (o: SelectOption) => void;
}

export default class SelectGroup extends React.Component<SelectGroupProps, any> {

    //noinspection JSUnusedGlobalSymbols
    public static defaultProps = {
        className: "",
        disabled: false
    };

    public render() {
        return (
            <optgroup disabled={this.props.disabled} label={this.props.label}>
                {this.renderChildren()}
            </optgroup>
        );
    }

    private renderChildren(): Array<React.Component<any, any>> {
        return React.Children.map<any>(
            (this.props.children as SelectOption[]),
            (child: React.ReactChild) => {
                if (typeof child === "object" && child.type === SelectOption) {
                    return React.cloneElement(child, {
                        selected: child.props.value === this.props.selectedValue,
                        disabled: this.props.disabled || child.props.disabled,
                        ref: this.props.optionRef
                    });
                }

                return child;
            }
        );
    }
}