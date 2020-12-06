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
import NodeList from "./FolderContent";
import ParentElement from "./ParentElement";
import SceneStore from "../../stores/SceneStore";
import ActiveFolder from "./ActiveFolder";
import { TreeElement } from "../../classes/TreeElement";

interface SideBarProps {
    sceneStore: SceneStore;
}

@observer
export default class SideBar extends React.Component<SideBarProps, any> {
    public render() {
        const { sceneStore } = this.props;

        if (sceneStore.selectedElement === null) {
            return <div id="app-sidebar" className="side-bar" />;
        }

        const activeFolder = this.getActiveFolder(sceneStore.selectedElement);

        return (
            <div id="app-sidebar" className="side-bar">
                <h3>{sceneStore.selectedElement.name}</h3>
                <ParentElement
                    sceneStore={sceneStore}
                    selectedElement={sceneStore.selectedElement}
                />
                <ActiveFolder sceneStore={sceneStore} activeFolder={activeFolder} />
                <NodeList sceneStore={sceneStore} activeFolder={activeFolder} />
            </div>
        );
    }

    private getActiveFolder(element: TreeElement): TreeElement | null {
        return element.isFile() ? this.getParentElement(element) : element;
    }

    private getParentElement(element: TreeElement): TreeElement | null {
        if (!this.props.sceneStore.projectData) {
            return null;
        }

        return element.parent ? element.parent : null;
    }
}
