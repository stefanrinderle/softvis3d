import {PreviewPicture} from "../classes/PreviewPicture";
import Layout from "../classes/Layout";
import Profile from "../classes/Profile";

const customDistrict: PreviewPicture = {
    forLayout: (l: Layout) => l.id === "district",
    forProfile: (p: Profile) => p.id === "custom",
    bgPicture: "static/resources/preview-district.png",
    contents: null
};

const customEvostreet: PreviewPicture = {
    forLayout: (l: Layout) => l.id === "evostreet",
    forProfile: (p: Profile) => p.id === "custom",
    bgPicture: "static/resources/preview-evostreet.png",
    contents: null
};

const placeholder: PreviewPicture = {
    forLayout: () => false,
    forProfile: () => false,
    bgPicture: "http://lorempixel.com/300/200/animals/PLACEHOLDER",
    contents: null
};

export {
    customDistrict,
    customEvostreet,
    placeholder
};