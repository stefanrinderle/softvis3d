import * as React from "react";

type ChangeEvent = (value: any, event: React.SyntheticEvent, src: React.Component<any, any>) => void;

interface SelectBoxProps {
    children?: Array<SelectOption|SelectGroup>;

    className?: string;
    disabled?: boolean;
    value?: any;

    onChange: ChangeEvent;
}

export class SelectBox extends React.Component<SelectBoxProps, any> {
    public static defaultProps = {
        className: "",
        disabled: false
    };

    public handleChange(event: React.SyntheticEvent) {
        const newValue = JSON.parse((event.target as HTMLOptionElement).value);
        this.props.onChange(newValue, event, this);
    }

    public renderChildren(): Array<React.Component<any, any>> {
        return React.Children.map<any>(this.props.children, (child: React.ReactElement<any>) => {
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
        });
    }

    public render() {
        return (
            <select
                disabled={this.props.disabled}
                className={this.props.className}
                value={JSON.stringify(this.props.value)}
                onChange={this.handleChange.bind(this)}
            >
                {this.renderChildren()}
            </select>
        );
    }
}

interface SelectOptionProps {
    checked?: boolean;
    disabled?: boolean;
    value: any;
    label: string;
}

export class SelectOption extends React.Component<SelectOptionProps, any> {
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

interface SelectGroupProps {
    selectedValue?: any;
    children?: Array<SelectOption>;
    disabled?: boolean;
    label: string;
}

export class SelectGroup extends React.Component<SelectGroupProps, any> {
    public static defaultProps = {
        className: "",
        disabled: false
    };

    public renderChildren(): Array<React.Component<any, any>> {
        return React.Children.map<any>(this.props.children, (child: React.ReactElement<any>) => {
            if (child.type === SelectOption) {
                return React.cloneElement(child, {
                    checked: child.props.value === this.props.selectedValue,
                    disabled: this.props.disabled || child.props.disabled
                });
            } else {
                return child;
            }
        });
    }

    public render() {
        return (
            <optgroup disabled={this.props.disabled} label={this.props.label}>
                {this.renderChildren()}
            </optgroup>
        );
    }
}