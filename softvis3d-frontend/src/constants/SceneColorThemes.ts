///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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

import { SceneColorTheme } from "../classes/SceneColorTheme";

const DEFAULT_COLOR_THEME: SceneColorTheme = {
    id: "default",
    backgroundColor: 0xffffff
};

const DARK_COLOR_THEME: SceneColorTheme = {
    id: "dark",
    backgroundColor: 0x282829
};

export {
    DEFAULT_COLOR_THEME,
    DARK_COLOR_THEME
};

export class SceneColorThemes {

    public static availableColorThemes: SceneColorTheme[] = [
        DEFAULT_COLOR_THEME,
        DARK_COLOR_THEME
    ];

    public static getColorThemeById(themeId: string): SceneColorTheme | undefined {
        if (themeId !== undefined) {
            for (const availableTheme of SceneColorThemes.availableColorThemes) {
                if (availableTheme.id === themeId) {
                    return availableTheme;
                }
            }
        }
    }
}