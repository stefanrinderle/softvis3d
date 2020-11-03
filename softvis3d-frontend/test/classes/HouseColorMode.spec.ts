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
import HouseColorMode from '../../src/classes/HouseColorMode';

describe("HouseColorMode", () => {

    it("should implement SelectOptionValue", () => {
        let expectedId: string = "23";
        let expectedLabel: string = "INT";
        let expectedDescription: string = "ksudfhiusdhfs";

        let result: HouseColorMode = new HouseColorMode(expectedId, expectedLabel, expectedDescription, 0, 0);

        expect(result.label).to.be.eq(expectedLabel);
        expect(result.id).to.be.eq(expectedId);
        expect(result.description).to.be.eq(expectedDescription);
    });

});
