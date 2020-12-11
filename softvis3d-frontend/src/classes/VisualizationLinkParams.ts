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

import { Type } from "class-transformer";
import { Vector3 } from "three";
import VisualizationOptionStore from "../stores/VisualizationOptionStore";

export default class VisualizationLinkParams {
    @Type(() => VisualizationOptionStore)
    public visualizationOptions: VisualizationOptionStore;
    public selectedObjectId: string | null;
    public cameraPosition: Vector3;

    constructor(
        visualizationOptions: VisualizationOptionStore,
        selectedObjectId: string | null,
        cameraPosition: Vector3
    ) {
        this.visualizationOptions = visualizationOptions;
        this.selectedObjectId = selectedObjectId;
        this.cameraPosition = cameraPosition;
    }
}
