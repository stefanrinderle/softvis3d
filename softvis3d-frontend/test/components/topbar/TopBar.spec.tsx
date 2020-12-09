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
import { shallow } from "enzyme";
import * as React from "react";
import SelectedElementInfo from "../../../src/components/topbar/SelectedElementInfo";
import TopBar from "../../../src/components/topbar/TopBar";
import TopBarMenu from "../../../src/components/topbar/TopBarMenu";

describe("<TopBar/>", () => {
    it("should show default text div on start", () => {
        const selectedElementInfo = shallow(<TopBar />);

        expect(selectedElementInfo.contains(<SelectedElementInfo />)).to.be.true;
        expect(selectedElementInfo.contains(<TopBarMenu />)).to.be.true;
    });
});
