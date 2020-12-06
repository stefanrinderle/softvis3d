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
import SceneStore from "../stores/SceneStore";
import CityBuilder from "./citybuilder/CityBuilder";
import Status from "./status/Status";
import Visualization from "./visualization/Visualization";

interface Softvis3DProps {
    sceneStore: SceneStore;
    baseUrl?: string;
}

@observer
export default class Softvis3D extends React.Component<Softvis3DProps, any> {
    public render() {
        const { sceneStore, baseUrl } = this.props;
        return (
            <div>
                <Status />
                <CityBuilder sceneStore={sceneStore} baseUrl={baseUrl} />
                <Visualization sceneStore={sceneStore} />
            </div>
        );
    }
}
