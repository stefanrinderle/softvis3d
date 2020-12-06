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
