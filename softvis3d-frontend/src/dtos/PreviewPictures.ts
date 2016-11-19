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
    forLayout: () => true,
    forProfile: () => true,
    bgPicture: "http://placekitten.com/600/400",
    contents: null
};

export {
    customDistrict,
    customEvostreet,
    placeholder
};