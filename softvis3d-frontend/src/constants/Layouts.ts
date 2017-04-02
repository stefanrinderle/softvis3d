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

export class Layouts {

    public static availableLayouts: Layout[] = [
        evostreet,
        district
    ];

    public static getLayoutById(layoutId: string): Layout | undefined {
        if (layoutId !== undefined) {
            for (const availableLayout of Layouts.availableLayouts) {
                if (availableLayout.id === layoutId) {
                    return availableLayout;
                }
            }
        }
    }
}