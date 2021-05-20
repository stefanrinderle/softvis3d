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
import { RadioButton } from "./RadioButton";

type LocalChangeEvent = (
    value: any,
    event: LocalChangeEvent,
    src: React.Component<any, any>
) => void;

interface RadioGroupProps {
    key?: string | number;
    ref?: string | ((component: RadioGroup) => any);

    className?: string;
    disabled?: boolean;
    value?: any;

    onChange: LocalChangeEvent;
}

export class RadioGroup extends React.Component<RadioGroupProps, any> {
    //noinspection JSUnusedGlobalSymbols
    public static defaultProps = {
        className: "",
        disabled: false,
    };

    public handleChange(val: any, event: any, context: any): void {
        this.props.onChange(val, event, context);
    }

    public renderChildren(): Array<React.Component<any, any>> {
        return React.Children.map<React.ReactChild, any>(
            this.props.children as RadioButton[],
            (child: React.ReactChild) => {
                if (typeof child === "object" && child.type === RadioButton) {
                    return React.cloneElement(child, {
                        checked: child.props.value.id === this.props.value.id,
                        disabled: this.props.disabled || child.props.disabled,
                        onChange: this.handleChange.bind(this, child.props.value),
                    });
                }

                return child;
            }
        );
    }

    public render() {
        const className = "radio-group " + (this.props.className || "");
        return <div className={className}>{this.renderChildren()}</div>;
    }
}
