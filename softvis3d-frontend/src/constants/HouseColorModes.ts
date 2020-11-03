import HouseColorMode from "../classes/HouseColorMode";

const DEFAULT_HOUSE_COLOR_MODE: HouseColorMode = new HouseColorMode("default", "Default colors",
    "Green for 'good' to red for 'bad'",
    0x00CC00, 0xEE0000);

const ADDITIONAL_HOUSE_COLOR_MODE: HouseColorMode = new HouseColorMode("accessible", "Accessible colors",
    "Blue for 'good' to yellow for 'bad'",
    0x0000FF, 0xDCDC00);

export {
    DEFAULT_HOUSE_COLOR_MODE,
    ADDITIONAL_HOUSE_COLOR_MODE
};

export class HouseColorModes {

    public static availableHouseColorModes: HouseColorMode[] = [
        DEFAULT_HOUSE_COLOR_MODE,
        ADDITIONAL_HOUSE_COLOR_MODE
    ];

    public static getModeById(modeId: string): HouseColorMode | undefined {
        if (!modeId) {
            return;
        }

        for (const availableMode of HouseColorModes.availableHouseColorModes) {
            if (availableMode.id === modeId) {
                return availableMode;
            }
        }
    }
}