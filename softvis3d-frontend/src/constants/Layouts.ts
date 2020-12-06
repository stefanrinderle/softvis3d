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

import Layout from "../classes/Layout";

const district = new Layout(
    "district",
    "District",
    "Standard CodeCity layout. Classes and files map to buildings and packages map to districts."
);

const evostreet = new Layout(
    "evostreet",
    "Evostreet",
    "Is a stable layout for visualizing evolving software systems. Each street represents one subsystem " +
    "(folder, package) and branching streets show contained subsystems."
);

export {
    district,
    evostreet
};

export class Layouts {

    public static availableLayouts: Layout[] = [
        evostreet,
        district
    ];

    public static getLayoutById(layoutId: string): Layout | undefined {
        if (layoutId !== undefined) {
            for (const availableLayout of Layouts.availableLayouts) {
                if (availableLayout.id === layoutId) {
                    return availableLayout;
                }
            }
        }
    }
}