import Layout from "../classes/Layout";
import { PreviewPicture } from "../classes/PreviewPicture";
import Profile from "../classes/Profile";
import { defaultProfile, leakPeriod, duplicatedLinesOfCode } from "./Profiles";

const defaultDistrict: PreviewPicture = {
    forLayout: (l: Layout) => l.getId() === "district",
    forProfile: (p: Profile) => p.getId() === defaultProfile.getId(),
    bgPicture: "static/resources/preview/district_complexity_loc_EXTINT.png"
};

const defaultEvostreet: PreviewPicture = {
    forLayout: (l: Layout) => l.getId() === "evostreet",
    forProfile: (p: Profile) => p.getId() === defaultProfile.getId(),
    bgPicture: "static/resources/preview/evostreet_complexity_loc_EXTINT.png"
};

const leakDistrict: PreviewPicture = {
    forLayout: (l: Layout) => l.getId() === "district",
    forProfile: (p: Profile) => p.getId() === leakPeriod.getId(),
    bgPicture: "static/resources/preview/district_complexity_newLOC_ApacheCommons_Lang.png"
};

const leakEvostreet: PreviewPicture = {
    forLayout: (l: Layout) => l.getId() === "evostreet",
    forProfile: (p: Profile) => p.getId() === leakPeriod.getId(),
    bgPicture: "static/resources/preview/evostreet_complexity_newLOC_ApacheCommons_Lang.png"
};

const duplicateDistrict: PreviewPicture = {
    forLayout: (l: Layout) => l.getId() === "district",
    forProfile: (p: Profile) => p.getId() === duplicatedLinesOfCode.getId(),
    bgPicture: "static/resources/preview/district_complexity_duplicatedLOC_LMSAPP_SHOP.png"
};

const duplicateEvostreet: PreviewPicture = {
    forLayout: (l: Layout) => l.getId() === "evostreet",
    forProfile: (p: Profile) => p.getId() === duplicatedLinesOfCode.getId(),
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