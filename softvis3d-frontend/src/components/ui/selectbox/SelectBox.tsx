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
import SelectGroup from "./SelectGroup";
import {ChangeEvent, MouseEventHandler} from "react";

type LocalChangeEvent = (value: any) => void|boolean;

interface SelectBoxProps {
    prepend?: JSX.Element[];
    append?: JSX.Element[];

    className?: string;
    disabled?: boolean;
    value: SelectOptionValue;
    label?: string;

    onChange: LocalChangeEvent;
    onClick?: MouseEventHandler<HTMLElement>;
    onMouseDown?: MouseEventHandler<HTMLElement>;
}

interface ValueStore {
    [index: string]: SelectOptionValue;
}

export default class SelectBox extends React.Component<SelectBoxProps, any> {

    //noinspection JSUnusedGlobalSymbols
    public static defaultProps = {
        prepend: [],
        append: [],
        className: "",
        disabled: false,
        value: null
    };

    private values: ValueStore = {};

    public handleChange(event: ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;

        if (value in this.values) {
            this.props.onChange(this.values[value]);
        }
    }

    public render() {
        const noEvent = () => {
            // do nothing.
        };
        const clickEvent: MouseEventHandler<HTMLElement> = this.props.onClick || noEvent;
        const mouseDownEvent = this.props.onMouseDown || noEvent;
        const className = "selectbox " + (this.props.className || "");

        return (
            <div className={className.trim()}>
                {this.props.prepend}
                {this.renderLabel()}
                <select
                    disabled={this.props.disabled}
                    className={this.props.className}
                    value={this.props.value.id}
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

    private addValue(v: SelectOptionValue) {
        this.values[v.id] = v;
    }

    private clearValues() {
        this.values = {};
    }

    private renderChildren(): Array<React.Component<any, any>> {
        this.clearValues();
        const ref = (o: SelectOption | null) => {
            if (!o) {
                this.clearValues();
            } else {
                const v: SelectOptionValue = o.props.value;
                this.addValue(v);
            }
        };

        return React.Children.map<any>(
            (this.props.children as Array<SelectOption|SelectGroup>),
            (child: React.ReactChild) => {
                if (typeof child === "object" && child.type === SelectOption) {
                    return React.cloneElement(child, {
                        selected: child.props.value === this.props.value,
                        disabled: this.props.disabled || child.props.disabled,
                        ref
                    });
                }

                if (typeof child === "object" && child.type === SelectGroup) {
                    return React.cloneElement(child, {
                        selectedValue: this.props.value,
                        disabled: this.props.disabled || child.props.disabled,
                        optionRef: ref
                    });
                }

                return child;
            }
        );
    }
}