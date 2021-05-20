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
import { ChangeEvent } from "react";

type BoundChangeEvent = (
    event: ChangeEvent<HTMLInputElement>,
    src: React.Component<any, any>
) => void;

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
    constructor(props: RadioButtonProps) {
        super(props);
    }

    //noinspection JSUnusedGlobalSymbols
    public static defaultProps = {
        className: "",
        activeClass: "active",
        disabled: false,
    };

    public handleClick(event: ChangeEvent<HTMLInputElement>): void {
        if (!this.props.disabled && this.props.onChange) {
            this.props.onChange(event, this);
        }
    }

    public render() {
        let className = this.props.className;
        className += this.props.checked ? " " + this.props.activeClass : "";
        return (
            <label className={className} id={"select-" + this.props.value.id}>
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
