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
import { expect } from "chai";
import ColorThemeSelector from "../../src/classes/ColorThemeSelector";
import { DARK_COLOR_THEME, DEFAULT_COLOR_THEME } from "../../src/constants/SceneColorThemes";

describe("ColorThemeSelector", () => {

    it("should return dark if default is current", () => {
        expect(ColorThemeSelector.toggleColorTheme(DARK_COLOR_THEME)).to.be.eq(DEFAULT_COLOR_THEME);
    });

    it("should return default if dark is current", () => {
        expect(ColorThemeSelector.toggleColorTheme(DEFAULT_COLOR_THEME)).to.be.eq(DARK_COLOR_THEME);
    });
});