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
import SceneStore from "../../stores/SceneStore";
import { TreeElement } from "../../classes/TreeElement";

interface ElementInfoProps {
    element: TreeElement;
    sceneStore: SceneStore;
    isSelected: boolean;
}

/**
 * Currently used for an example use of selected scene object store.
 */
export default class FolderContentElement extends React.Component<ElementInfoProps, any> {
    public render() {
        const { element, isSelected } = this.props;
        const classes = [];
        classes.push(element.isFile() ? "leaf" : "node");

        if (isSelected) {
            classes.push("current-selected");
        }

        return (
            <li
                key={element.id}
                className={classes.join(" ")}
                onClick={() => isSelected || this.selectElement()}
            >
                {this.props.element.name}
            </li>
        );
    }

    private selectElement() {
        this.props.sceneStore.selectedObjectId = this.props.element.id;
    }
}
