import BuildingColorTheme from "../classes/BuildingColorTheme";

const DEFAULT_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("default", "Green-Red colors",
    0x00CC00, 0xEE0000);

const BLUEYELLOW_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("acc-blueyellow", "Blue-Yellow colors",
    0x0000FF, 0xDCDC00);

const GRAYSCALE_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("acc-grayscale", "Grayscale",
    0xCCCCCC, 0x191919);

export {
    DEFAULT_BUILDING_COLOR_THEME,
    BLUEYELLOW_BUILDING_COLOR_THEME,
    GRAYSCALE_BUILDING_COLOR_THEME
};

export class BuildingColorThemes {

    public static availableBuildingColorThemes: BuildingColorTheme[] = [
        DEFAULT_BUILDING_COLOR_THEME,
        BLUEYELLOW_BUILDING_COLOR_THEME,
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
