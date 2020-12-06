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

import { observer } from "mobx-react";
import * as React from "react";
import Layout from "../../classes/Layout";
import { lazyInject } from "../../inversify.config";
import CityBuilderStore from "../../stores/CityBuilderStore";
import { RadioButton } from "../ui/RadioButton";
import { RadioGroup } from "../ui/RadioGroup";

export interface LayoutPickerProps {
    layouts: Layout[];
}

@observer
export default class LayoutPicker extends React.Component<LayoutPickerProps, any> {
    @lazyInject("CityBuilderStore")
    private readonly cityBuilderStore!: CityBuilderStore;

    public render() {
        const { layouts } = this.props;
        return (
            <div className="layout-component">
                <RadioGroup
                    onChange={(l: Layout) => {
                        this.cityBuilderStore.options.layout = l;
                    }}
                    value={this.cityBuilderStore.options.layout}
                    className={"list"}
                >
                    {this.mapLayouts(layouts)}
                </RadioGroup>
            </div>
        );
    }

    private mapLayouts(l: Layout[]): RadioButton[] {
        return l.map((layout) => (
            <RadioButton key={layout.id} value={layout} label={layout.label} />
        )) as any[];
    }
}
