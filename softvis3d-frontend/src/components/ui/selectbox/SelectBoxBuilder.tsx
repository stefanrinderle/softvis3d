import * as React from "react";
import SelectBox from "./SelectBox";
import SelectOption from "./SelectOption";

export interface SelectBoxBuilderProps {
    className?: string;
    label: string;
    value: any;
    options: SelectOptionValue[];
    onChange: (value: any) => void|boolean;
    onClick?: (event: React.SyntheticEvent) => void|boolean;
    onMouseDown?: (event: React.SyntheticEvent) => void|boolean;
    disabled?: boolean;
    prepend?: JSX.Element[];
    append?: JSX.Element[];
}

export default class SelectBoxBuilder extends React.Component<SelectBoxBuilderProps, any> {
    public render() {
        return (
            <SelectBox
                className={this.props.className}
                label={this.props.label}
                onMouseDown={this.props.onMouseDown}
                onClick={this.props.onClick}
                onChange={this.props.onChange}
                value={this.props.value}
                prepend={this.props.prepend}
                append={this.props.append}
            >
                {this.getSelectOptions()}
            </SelectBox>
        );
    }

    private getSelectOptions() {
        return this.props.options
            .map((selectOptionElement) => <SelectOption
                selectOptionElement={selectOptionElement}
                disabled={this.props.disabled}
            />);
    }
}
