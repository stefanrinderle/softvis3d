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
import { AppConfiguration } from "../../src/classes/AppConfiguration";
import ComponentStatusStore from "../../src/stores/ComponentStatusStore";

describe("ComponentStatusStore", () => {
    it("should have set all default values on init", () => {
        const config = new AppConfiguration("example:key", false);
        const underTest: ComponentStatusStore = new ComponentStatusStore(config);
        expect(underTest.lastAnalysisDate).to.be.undefined;
        expect(underTest.appConfiguration).to.be.eq(config);
    });
});

export function createDefaultTestComponentStatusStore() {
    const config = new AppConfiguration("example:key", false);
    return new ComponentStatusStore(config);
}
