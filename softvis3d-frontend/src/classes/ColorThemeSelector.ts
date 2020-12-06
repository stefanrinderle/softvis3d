///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

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
