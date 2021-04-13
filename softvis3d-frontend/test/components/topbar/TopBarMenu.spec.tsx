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
import TopBarMenu from "../../../src/components/topbar/TopBarMenu";
import TopBarShareButton from "../../../src/components/topbar/TopBarShareButton";
import CityBuilderStore from "../../../src/stores/CityBuilderStore";
import { createMockInjection } from "../../Helper";

describe("<TopBarMenu/>", () => {
    it("should show settings button and check action", () => {
        const localCityBuilderStore: CityBuilderStore = createMockInjection(new CityBuilderStore());

        const topBarMenu = shallow(<TopBarMenu />);

        const settingsButton = topBarMenu.find("#options-button");

        settingsButton.simulate("click");
        expect(localCityBuilderStore.show).to.be.true;
    });

    it("should have share component", () => {
        const localCityBuilderStore: CityBuilderStore = createMockInjection(new CityBuilderStore());

        localCityBuilderStore.show = true;

        const topBarMenu = shallow(<TopBarMenu />);

        expect(topBarMenu.contains(<TopBarShareButton disabled={true} />)).to.be.true;
    });
});
