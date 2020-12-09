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
import NodeList from "./FolderContent";
import ParentElement from "./ParentElement";
import SceneStore from "../../stores/SceneStore";
import ActiveFolder from "./ActiveFolder";
import { TreeElement } from "../../classes/TreeElement";

@observer
export default class SideBar extends React.Component<Record<string, unknown>, any> {
    @lazyInject("SceneStore")
    private readonly sceneStore!: SceneStore;

    public render() {
        if (this.sceneStore.selectedElement === null) {
            return <div id="app-sidebar" className="side-bar" />;
        }

        const activeFolder = this.getActiveFolder(this.sceneStore.selectedElement);

        return (
            <div id="app-sidebar" className="side-bar">
                <h3>{this.sceneStore.selectedElement.name}</h3>
                <ParentElement />
                <ActiveFolder activeFolder={activeFolder} />
                <NodeList activeFolder={activeFolder} />
            </div>
        );
    }

    private getActiveFolder(element: TreeElement): TreeElement | null {
        return element.isFile() ? this.getParentElement(element) : element;
    }

    private getParentElement(element: TreeElement): TreeElement | null {
        if (!this.sceneStore.projectData) {
            return null;
        }

        return element.parent ? element.parent : null;
    }
}
