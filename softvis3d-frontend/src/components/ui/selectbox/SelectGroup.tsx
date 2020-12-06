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
        disabled: false,
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
            this.props.children as SelectOption[],
            (child: React.ReactChild) => {
                if (typeof child === "object" && child.type === SelectOption) {
                    return React.cloneElement(child, {
                        selected: child.props.value === this.props.selectedValue,
                        disabled: this.props.disabled || child.props.disabled,
                        ref: this.props.optionRef,
                    });
                }

                return child;
            }
        );
    }
}
