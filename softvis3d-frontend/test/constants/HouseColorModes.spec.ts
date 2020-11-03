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
import {
    ADDITIONAL_HOUSE_COLOR_MODE,
    DEFAULT_HOUSE_COLOR_MODE,
    HouseColorModes
} from '../../src/constants/HouseColorModes';

describe("HouseColorModes", () => {

    it("should provide available modes", () => {
        expect(HouseColorModes.availableHouseColorModes.length).to.be.greaterThan(0);
    });

    it("should find modes by id", () => {
        expect(HouseColorModes.getModeById(DEFAULT_HOUSE_COLOR_MODE.id)).to.be.eq(DEFAULT_HOUSE_COLOR_MODE);

        expect(HouseColorModes.getModeById(ADDITIONAL_HOUSE_COLOR_MODE.id)).to.be.eq(ADDITIONAL_HOUSE_COLOR_MODE);
    });

});