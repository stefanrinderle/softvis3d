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
import SceneStore from "../../stores/SceneStore";
import { TreeElement } from "../../classes/TreeElement";

interface NodeListProps {
    sceneStore: SceneStore;
    activeFolder: TreeElement | null;
}

@observer
export default class ActiveFolder extends React.Component<NodeListProps, any> {
    public render() {
        const { activeFolder, sceneStore } = this.props;

        if (activeFolder === null) {
            return <div />;
        }

        const folderClass =
            activeFolder.id === sceneStore.selectedObjectId ? "current-selected" : "";
        const onClick = () => {
            sceneStore.selectedObjectId = activeFolder.id;
        };

        return (
            <div className="select-current-folder">
                <span className={folderClass} onClick={onClick}>
                    {activeFolder.name}
                </span>
            </div>
        );
    }
}
