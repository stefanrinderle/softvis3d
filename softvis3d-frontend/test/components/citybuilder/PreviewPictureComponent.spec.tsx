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



import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import CityBuilderStore from "../../../src/stores/CityBuilderStore";
import PreviewPictureComponent from "../../../src/components/citybuilder/PreviewPictureComponent";

describe("<PreviewPictureComponent/>", () => {

    it("should show resolve url for preview picture", () => {
        const testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        const baseUrl = "";

        const underTest = shallow(
            <PreviewPictureComponent store={testCityBuilderStore} baseUrl={baseUrl}/>
        );

        expect(underTest.html()).to.include("evostreet_complexity_loc_EXTINT.png");
    });

    it("should show resolve url for preview picture with base url", () => {
        const testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        const baseUrl = "/isudfisu";

        const underTest = shallow(
            <PreviewPictureComponent store={testCityBuilderStore} baseUrl={baseUrl}/>
        );

        expect(underTest.html()).to.include(baseUrl);
    });
});