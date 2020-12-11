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
import { PreviewPicture } from "../../src/classes/PreviewPicture";
import { district, evostreet } from "../../src/constants/Layouts";
import {
    defaultDistrict,
    defaultEvostreet,
    getPreviewBackground,
    placeholder,
} from "../../src/constants/PreviewPictures";
import { custom, defaultProfile, leakPeriod } from "../../src/constants/Profiles";

describe("PreviewPicture", () => {
    it("should know its layout", () => {
        const bgPicture = "/static/resources/preview/evostreet_complexity_loc_EXTINT.png";

        const underTest: PreviewPicture = new PreviewPicture(bgPicture, evostreet, defaultProfile);

        expect(underTest.forLayout(evostreet)).to.be.eq(true);
        expect(underTest.forLayout(district)).to.be.eq(false);
    });

    it("should know its profile", () => {
        const bgPicture = "/static/resources/preview/evostreet_complexity_loc_EXTINT.png";

        const underTest: PreviewPicture = new PreviewPicture(bgPicture, evostreet, defaultProfile);

        expect(underTest.forProfile(defaultProfile)).to.be.eq(true);
        expect(underTest.forProfile(leakPeriod)).to.be.eq(false);
    });

    it("should get preview picture default profile and layout district", () => {
        const previewBackground = getPreviewBackground(district, defaultProfile);
        expect(previewBackground).to.be.equal(defaultDistrict);
    });

    it("should get preview picture default profile and layout  evostreets", () => {
        const previewBackground = getPreviewBackground(evostreet, defaultProfile);
        expect(previewBackground).to.be.equal(defaultEvostreet);
    });

    it("should get placeholder preview picture", () => {
        const previewBackground = getPreviewBackground(district, custom);
        expect(previewBackground).to.be.equal(placeholder);
    });
});
