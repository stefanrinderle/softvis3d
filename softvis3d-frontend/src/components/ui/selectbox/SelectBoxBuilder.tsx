///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///



import * as React from "react";
import SelectBox from "./SelectBox";
import SelectOption from "./SelectOption";
import {MouseEventHandler} from "react";

export interface SelectBoxBuilderProps {
    className?: string;
    label: string;
    value: SelectOptionValue;
    options: SelectOptionValue[];
    onChange: (value: any) => void|boolean;
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
