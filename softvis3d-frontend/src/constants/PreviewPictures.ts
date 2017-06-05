import {defaultProfile, duplicatedLinesOfCode, leakPeriod} from "./Profiles";
import {PreviewPicture} from "../classes/PreviewPicture";
import {district, evostreet} from "./Layouts";

const defaultDistrict: PreviewPicture =
    new PreviewPicture("/static/resources/preview/district_complexity_loc_EXTINT.png", district, defaultProfile);

const defaultEvostreet: PreviewPicture =
    new PreviewPicture("/static/resources/preview/evostreet_complexity_loc_EXTINT.png", evostreet, defaultProfile);

const leakDistrict: PreviewPicture =
    new PreviewPicture("/static/resources/preview/district_complexity_newLOC_ApacheCommons_Lang.png", district, leakPeriod);

const leakEvostreet: PreviewPicture =
    new PreviewPicture("/static/resources/preview/evostreet_complexity_newLOC_ApacheCommons_Lang.png", evostreet, leakPeriod);

const duplicateDistrict: PreviewPicture =
    new PreviewPicture("/static/resources/preview/district_complexity_duplicatedLOC_LMSAPP_SHOP.png", district, duplicatedLinesOfCode);

const duplicateEvostreet: PreviewPicture = new PreviewPicture(
    "/static/resources/preview/evostreet_complexity_duplicatedLOC_LMSAPP_SHOP.png", evostreet, duplicatedLinesOfCode);

const placeholder: PreviewPicture = new PreviewPicture("static/resources/preview/placeholderLogo.png");

export {
    defaultDistrict,
    defaultEvostreet,
    leakDistrict,
    leakEvostreet,
    duplicateDistrict,
    duplicateEvostreet,
    placeholder
};

export const availablePreviewPictures: PreviewPicture[] = [
    defaultDistrict,
    defaultEvostreet,
    leakDistrict,
    leakEvostreet,
    duplicateDistrict,
    duplicateEvostreet,
    placeholder
];