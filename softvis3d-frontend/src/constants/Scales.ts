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

import Scale from "../classes/Scale";

const LOGARITHMIC: Scale = new Scale(
    "logarithmic",
    "Logarithmic",
    "Building footprint and height values are calculated using a logarithmic scale " +
        "based the projects most degenerate file"
);
const EXPONENTIAL: Scale = new Scale(
    "exponential",
    "Exponential",
    "Building footprint and height values are calculated using a exponential scale " +
        "based the projects most degenerate file"
);
const LINEAR_SCALED: Scale = new Scale(
    "linear_s",
    "Linear (scaled)",
    "Building footprint and height will be scaled linearly. If a file's metric value exceeds " +
        " a maximum value the whole project will be scaled down."
);
const LINEAR: Scale = new Scale(
    "linear",
    "Linear",
    "Building footprint and height will be scaled linearly without a maximum value."
);

export { LOGARITHMIC, EXPONENTIAL, LINEAR_SCALED, LINEAR };

export class Scales {
    public static availableScales: Scale[] = [LOGARITHMIC, EXPONENTIAL, LINEAR_SCALED, LINEAR];

    public static getScaleById(scaleId: string): Scale | undefined {
        if (!scaleId) {
            return;
        }

        for (const availableScale of Scales.availableScales) {
            if (availableScale.id === scaleId) {
                return availableScale;
            }
        }
    }
}
