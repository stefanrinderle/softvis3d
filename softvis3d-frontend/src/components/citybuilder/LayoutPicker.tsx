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
import Layout from "../../classes/Layout";
import { Layouts } from "../../constants/Layouts";
import { lazyInject } from "../../inversify.config";
import VisualizationOptionStore from "../../stores/VisualizationOptionStore";

export class LayoutPicker extends React.Component<any, any> {
    @lazyInject("VisualizationOptionStore")
    private readonly visualizationOptions!: VisualizationOptionStore;

    render() {
        return (
            <div className={"layout-component"}>
                <div className={"radio-group list"}>
                    {this.createLayoutButtons(Layouts.availableLayouts)}
                </div>
            </div>
        );
    }

    private createLayoutButtons(l: Layout[]): JSX.Element[] {
        return l.map((layout) => (
            <label className={this.getClassName(layout)} id={"select-" + layout.id} key={layout.id}>
                <input
                    type={"radio"}
                    onChange={this.handleChange}
                    value={layout.id}
                    id={layout.id}
                    name="gender"
                    checked={this.isChecked(layout)}
                />
                {layout.label}
            </label>
        ));
    }

    handleChange = (e: any) => {
        const layout = Layouts.getLayoutById(e.target.value);
        if (layout !== undefined) {
            this.visualizationOptions.layout = layout;
        }
    };

    private isChecked(layout: Layout) {
        return this.visualizationOptions.layout.id === layout.id;
    }

    private getClassName(layout: Layout) {
        if (this.isChecked(layout)) {
            return "active";
        } else {
            return "";
        }
    }
}
