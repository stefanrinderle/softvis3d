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

import Layout from "../classes/Layout";
import Profile from "../classes/Profile";
import { defaultProfile, duplicatedLinesOfCode, leakPeriod } from "./Profiles";
import { PreviewPicture } from "../classes/PreviewPicture";
import { district, evostreet } from "./Layouts";

const defaultDistrict: PreviewPicture = new PreviewPicture(
    "/static/resources/preview/district_complexity_loc_EXTINT.png",
    district,
    defaultProfile
);

const defaultEvostreet: PreviewPicture = new PreviewPicture(
    "/static/resources/preview/evostreet_complexity_loc_EXTINT.png",
    evostreet,
    defaultProfile
);

const leakDistrict: PreviewPicture = new PreviewPicture(
    "/static/resources/preview/district_complexity_newLOC_ApacheCommons_Lang.png",
    district,
    leakPeriod
);

const leakEvostreet: PreviewPicture = new PreviewPicture(
    "/static/resources/preview/evostreet_complexity_newLOC_ApacheCommons_Lang.png",
    evostreet,
    leakPeriod
);

const duplicateDistrict: PreviewPicture = new PreviewPicture(
    "/static/resources/preview/district_complexity_duplicatedLOC_LMSAPP_SHOP.png",
    district,
    duplicatedLinesOfCode
);

const duplicateEvostreet: PreviewPicture = new PreviewPicture(
    "/static/resources/preview/evostreet_complexity_duplicatedLOC_LMSAPP_SHOP.png",
    evostreet,
    duplicatedLinesOfCode
);

const placeholder: PreviewPicture = new PreviewPicture(
    "/static/resources/preview/placeholderLogo.png"
);

export {
    defaultDistrict,
    defaultEvostreet,
    leakDistrict,
    leakEvostreet,
    duplicateDistrict,
    duplicateEvostreet,
    placeholder,
};

export const availablePreviewPictures: PreviewPicture[] = [
    defaultDistrict,
    defaultEvostreet,
    leakDistrict,
    leakEvostreet,
    duplicateDistrict,
    duplicateEvostreet,
    placeholder,
];

export function getPreviewBackground(layout: Layout, profile: Profile): PreviewPicture {
    for (const preview of availablePreviewPictures) {
        if (preview.forLayout(layout) && preview.forProfile(profile)) {
            return preview;
        }
    }

    return placeholder;
}
