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

import { expect } from "chai";
import { Vector3 } from "three";
import VisualizationLinkParams from "../../src/classes/VisualizationLinkParams";
import VisualizationOptionStore from "../../src/stores/VisualizationOptionStore";

describe("VisualizationLinkParams", () => {
    it("should construct config", () => {
        const selectedObjectKey = "123";
        const cameraPosition: Vector3 = new Vector3(0, 1, 2);
        const visualizationOptions = VisualizationOptionStore.createDefault();

        const result: VisualizationLinkParams = new VisualizationLinkParams(
            visualizationOptions,
            selectedObjectKey,
            cameraPosition
        );

        expect(result.visualizationOptions).to.be.eq(visualizationOptions);
        expect(result.selectedObjectKey).to.be.eq(selectedObjectKey);
        expect(result.cameraPosition).to.be.eq(cameraPosition);
    });
});
