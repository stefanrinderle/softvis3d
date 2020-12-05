import { SceneColorTheme } from "./SceneColorTheme";
import { DARK_COLOR_THEME, DEFAULT_COLOR_THEME } from "../constants/SceneColorThemes";

export default class ColorThemeSelector {

    public static toggleColorTheme(current: SceneColorTheme) {
        let resultColorTheme: SceneColorTheme;
        if (current.id === DEFAULT_COLOR_THEME.id) {
            resultColorTheme = DARK_COLOR_THEME;
        } else {
            resultColorTheme = DEFAULT_COLOR_THEME;
        }

        return resultColorTheme;
    }

}
