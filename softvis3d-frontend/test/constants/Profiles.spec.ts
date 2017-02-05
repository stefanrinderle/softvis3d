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
import {Profiles, custom, defaultProfile} from "../../src/constants/Profiles";

describe("Profiles", () => {

    it("should provide available profiles", () => {
        expect(Profiles.availableProfiles.length).to.be.greaterThan(0);
    });

    it("should find profile by id", () => {
        expect(Profiles.getAvailableProfileById(custom.id)).to.be.eq(custom);

        expect(Profiles.getAvailableProfileById(defaultProfile.id)).to.be.eq(defaultProfile);
    });

});