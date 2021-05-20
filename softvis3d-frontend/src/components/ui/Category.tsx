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

interface CategoryProps {
    className?: string;
    label: string;
    toggle?: boolean;
    initialVisibility?: boolean;
}

interface CategoryStates {
    visible: boolean;
}

export default class Category extends React.Component<CategoryProps, CategoryStates> {
    public static defaultProps = {
        className: "",
        toggle: false,
        initialVisibility: true,
    };

    public UNSAFE_componentWillMount() {
        this.setState({
            visible: this.props.initialVisibility as boolean,
        });
    }

    public render() {
        return (
            <fieldset className={this.getClassName()}>
                <legend onClick={() => this.toggleVisibility()}>{this.props.label}</legend>
                <div className="category-content">{this.props.children}</div>
            </fieldset>
        );
    }

    private getClassName() {
        const { toggle, className } = this.props;
        const classes: string[] = [];

        if (className) {
            classes.push(className);
        }

        if (toggle) {
            classes.push("collapsable");

            if (!this.state.visible) {
                classes.push("collapsed");
            }
        }

        return classes.join(" ");
    }

    private toggleVisibility(): void {
        this.setState({
            visible: !this.state.visible,
        });
    }
}
