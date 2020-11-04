import BuildingColorTheme from "../classes/BuildingColorTheme";

const DEFAULT_GREENRED_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("default-redgreen", "Green-Red colors",
    "Green for 'good' to red for 'bad'",
    0x00CC00, 0xEE0000);

const BLUEYELLOW_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("acc-blueyellow", "Blue-Yellow colors",
    "Blue for 'good' to yellow for 'bad'",
    0x0000FF, 0xDCDC00);

const BLUEYELLOW_DARK_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("acc-blueyellowdark", "Dark Blue-Yellow colors",
    "Blue for 'good' to yellow for 'bad'",
    0x4B0092, 0x1AFF1A);

const BLUEYELLOW_LIGHT_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("acc-blueyellowlight", "Light Blue-Yellow colors",
    "Blue for 'good' to yellow for 'bad'",
    0x0C7BDC, 0xFFC20A);

const BLUERED_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("acc-bluered", "Blue-Red colors",
    "Blue for 'good' to Red for 'bad'",
    0x005AB5, 0xDC3220);

const VIOLETYELLOW_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("acc-violetyellow", "Violet-Yellow colors",
    "Violet for 'good' to Yellow for 'bad'",
    0xD35FB7, 0xFEFE62);

const VIOLETRED_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("acc-violetred", "Violet-Red colors",
    "Violet for 'good' to Red for 'bad'",
    0x5D3A9B, 0xE66100);

const GRAYSCALE_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("acc-grayscale", "Grayscale",
    "Dark for 'good' to light for 'bad'",
    0xCCCCCC, 0x191919);


export {
    DEFAULT_GREENRED_BUILDING_COLOR_THEME,
    BLUEYELLOW_BUILDING_COLOR_THEME,
    BLUEYELLOW_DARK_BUILDING_COLOR_THEME,
    BLUEYELLOW_LIGHT_BUILDING_COLOR_THEME,
    BLUERED_BUILDING_COLOR_THEME,
    VIOLETYELLOW_BUILDING_COLOR_THEME,
    VIOLETRED_BUILDING_COLOR_THEME,
    GRAYSCALE_BUILDING_COLOR_THEME
};

export class BuildingColorThemes {

    public static availableBuildingColorThemes: BuildingColorTheme[] = [
        DEFAULT_GREENRED_BUILDING_COLOR_THEME,
        BLUEYELLOW_BUILDING_COLOR_THEME,
        BLUEYELLOW_DARK_BUILDING_COLOR_THEME,
        BLUEYELLOW_LIGHT_BUILDING_COLOR_THEME,
        BLUERED_BUILDING_COLOR_THEME,
        VIOLETYELLOW_BUILDING_COLOR_THEME,
        VIOLETRED_BUILDING_COLOR_THEME,
        GRAYSCALE_BUILDING_COLOR_THEME
    ];

    public static getModeById(modeId: string): BuildingColorTheme | undefined {
        if (!modeId) {
            return;
        }

        for (const availableMode of BuildingColorThemes.availableBuildingColorThemes) {
            if (availableMode.id === modeId) {
                return availableMode;
            }
        }
    }
}
