import * as React from "react";
import SelectBox from "./SelectBox";
import SelectOption from "./SelectOption";
import {MouseEventHandler} from "react";

export interface SelectBoxBuilderProps {
    className?: string;
    label: string;
    value: SelectOptionValue;
    options: SelectOptionValue[];
    onChange: (value: SelectOptionValue) => void|boolean;
    onClick?: MouseEventHandler<HTMLElement>;
    onMouseDown?: MouseEventHandler<HTMLElement>;
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

    private getSelectOptions(): SelectOption[] {
        return this.props.options
            .map((option) => <SelectOption
                key={option.id}
                value={option}
                disabled={this.props.disabled}
            />) as any;
    }
}
