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
import {observer} from "mobx-react";
import SceneStore from "../../stores/SceneStore";
import {TreeElement} from "../../classes/TreeElement";

interface SelectParentProps {
    sceneStore: SceneStore;
    selectedElement: TreeElement;
}

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class ParentElement extends React.Component<SelectParentProps, any> {

    public render() {
        const {sceneStore, selectedElement} = this.props;
        const parent: TreeElement | null = this.getParentElement(selectedElement);

        if (parent === null || typeof parent === "undefined") {
            return <div className="select-parent" />;
        }

        const myParent = parent;
        return (
            <div className="select-parent">
                <span onClick={() => { sceneStore.selectedObjectId = myParent.id; }}>
                    {myParent.name}
                </span>
            </div>
        );
    }

    private getParentElement(element: TreeElement): TreeElement | null {
        if (element && element.parent) {
            if (element.isFile()) {
                return this.getParentElement(element.parent);
            } else {
                return element.parent;
            }
        }
        return null;
    }
}
