import BuildingColorTheme from "../classes/BuildingColorTheme";

const DEFAULT_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("default", "Default colors",
    "Green for 'good' to red for 'bad'",
    0x00CC00, 0xEE0000);

const ADDITIONAL_BUILDING_COLOR_THEME: BuildingColorTheme = new BuildingColorTheme("accessible", "Accessible colors",
    "Blue for 'good' to yellow for 'bad'",
    0x0000FF, 0xDCDC00);

export {
    DEFAULT_BUILDING_COLOR_THEME,
    ADDITIONAL_BUILDING_COLOR_THEME
};

export class BuildingColorThemes {

    public static availableBuildingColorThemes: BuildingColorTheme[] = [
        DEFAULT_BUILDING_COLOR_THEME,
        ADDITIONAL_BUILDING_COLOR_THEME
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