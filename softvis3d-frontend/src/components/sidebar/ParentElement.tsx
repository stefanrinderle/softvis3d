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
import { observer } from "mobx-react";
import { lazyInject } from "../../inversify.config";
import SelectedElementService from "../../services/SelectedElementService";
import SceneStore from "../../stores/SceneStore";
import { TreeElement } from "../../classes/TreeElement";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class ParentElement extends React.Component<Record<string, unknown>, any> {
    @lazyInject("SceneStore")
    private readonly sceneStore!: SceneStore;
    @lazyInject("SelectedElementService")
    private readonly selectedElementService!: SelectedElementService;

    public render() {
        const selectedElement = this.selectedElementService.getSelectedElement();
        if (selectedElement !== null) {
            const parent: TreeElement | null = this.getParentElement(selectedElement);

            if (parent === null || typeof parent === "undefined") {
                return <div className="select-parent" />;
            }

            const myParent = parent;
            return (
                <div className="select-parent">
                    <span
                        onClick={() => {
                            this.sceneStore.selectedObjectId = myParent.id;
                        }}
                    >
                        {myParent.name}
                    </span>
                </div>
            );
        } else {
            return <div></div>;
        }
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
