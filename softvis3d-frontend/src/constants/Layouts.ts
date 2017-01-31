import Layout from "../classes/Layout";

const district = new Layout(
    "district",
    "District",
    "Standard CodeCity layout. Classes and files map to buildings and packages map to districts."
);

const evostreet = new Layout(
    "evostreet",
    "Evostreet",
    "Is a stable layout for visualizing evolving software systems. Each street represents one subsystem " +
    "(folder, package) and branching streets show contained subsystems."
);

export {
    district,
    evostreet
};

export const availableLayouts: Layout[] = [
    district,
    evostreet
];