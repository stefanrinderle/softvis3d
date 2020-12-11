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
import { AppConfiguration } from "../../../src/classes/AppConfiguration";
import PreviewPictureComponent from "../../../src/components/citybuilder/PreviewPictureComponent";
import { availablePreviewPictures } from "../../../src/constants/PreviewPictures";
import ComponentStatusStore from "../../../src/stores/ComponentStatusStore";
import { createMockInjection } from "../../Helper";
import { createDefaultTestComponentStatusStore } from "../../stores/ComponentStatusStore.spec";

describe("<PreviewPictureComponent/>", () => {
    it("should show resolve url for preview picture", () => {
        createMockInjection(createDefaultTestComponentStatusStore());

        const underTest = shallow(
            <PreviewPictureComponent previewPicture={availablePreviewPictures[0]} />
        );

        expect(underTest.html()).to.include("district_complexity_loc_EXTINT.png");
    });

    it("should show resolve url for preview picture with base url", () => {
        const baseUrl = "/isudfisu";
        createMockInjection(new ComponentStatusStore(new AppConfiguration("", false, baseUrl)));

        const underTest = shallow(
            <PreviewPictureComponent previewPicture={availablePreviewPictures[0]} />
        );

        expect(underTest.html()).to.include(baseUrl);
    });
});
