///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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

import {expect} from "chai";
import {Camera} from "../../../../../src/components/scene/visualization/scene/Camera";

describe("Camera", () => {

    it("should construct and init camera", () => {
        let container: any = {
            clientWidth: 14,
            clientHeight: 56
        };

        let underTest: Camera = new Camera(container);

        expect(underTest.getCamera()).not.to.be.null;
    });

    it("should construct and init camera", () => {
        let container: any = {
            clientWidth: 14,
            clientHeight: 56
        };

        let underTest: Camera = new Camera(container);

        let positionX = 4;
        let positionY = 5;
        let positionZ = 6;
        underTest.setCameraPosition(positionX, positionY, positionZ);

        expect(underTest.getCameraPosition().x).to.be.eq(positionX);
        expect(underTest.getCameraPosition().y).to.be.eq(positionY);
        expect(underTest.getCameraPosition().z).to.be.eq(positionZ);
    });

    it("should set aspect", () => {
        let container: any = {
            clientWidth: 14,
            clientHeight: 56
        };

        let underTest: Camera = new Camera(container);

        let width = 34;
        let height = 34;
        underTest.setAspect(width, height);

        expect(underTest.getCamera().aspect).to.be.eq(width / height);
    });
});