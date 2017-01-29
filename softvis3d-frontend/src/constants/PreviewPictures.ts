import {PreviewPicture} from "./PreviewPicture";
import {Profile} from "./Profile";
import {defaultProfile, leakPeriod, duplicatedLinesOfCode} from "./Profiles";

const defaultDistrict: PreviewPicture = {
    forLayout: (l: Layout) => l.id === "district",
    forProfile: (p: Profile) => p.id === defaultProfile.id,
    bgPicture: "static/resources/preview/district_complexity_loc_EXTINT.png"
};

const defaultEvostreet: PreviewPicture = {
    forLayout: (l: Layout) => l.id === "evostreet",
    forProfile: (p: Profile) => p.id === defaultProfile.id,
    bgPicture: "static/resources/preview/evostreet_complexity_loc_EXTINT.png"
};

const leakDistrict: PreviewPicture = {
    forLayout: (l: Layout) => l.id === "district",
    forProfile: (p: Profile) => p.id === leakPeriod.id,
    bgPicture: "static/resources/preview/district_complexity_newLOC_ApacheCommons_Lang.png"
};

const leakEvostreet: PreviewPicture = {
    forLayout: (l: Layout) => l.id === "evostreet",
    forProfile: (p: Profile) => p.id === leakPeriod.id,
    bgPicture: "static/resources/preview/evostreet_complexity_newLOC_ApacheCommons_Lang.png"
};

const duplicateDistrict: PreviewPicture = {
    forLayout: (l: Layout) => l.id === "district",
    forProfile: (p: Profile) => p.id === duplicatedLinesOfCode.id,
    bgPicture: "static/resources/preview/district_complexity_duplicatedLOC_LMSAPP_SHOP.png"
};

const duplicateEvostreet: PreviewPicture = {
    forLayout: (l: Layout) => l.id === "evostreet",
    forProfile: (p: Profile) => p.id === duplicatedLinesOfCode.id,
    bgPicture: "static/resources/preview/evostreet_complexity_duplicatedLOC_LMSAPP_SHOP.png"
};

const placeholder: PreviewPicture = {
    forLayout: () => false,
    forProfile: () => false,
    bgPicture: "static/resources/preview/placeholderLogo.png"
};

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