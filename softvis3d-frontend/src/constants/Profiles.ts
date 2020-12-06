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

import Profile, { ProfileBuilder } from "../classes/Profile";
import {
    complexityMetric,
    duplicatedLinesOfCodeMetric,
    linesOfCodeMetric,
    newLinesOfCodeMetric,
    noMetric,
} from "./Metrics";
import { Scales } from "./Scales";

const defaultProfile: Profile = new ProfileBuilder("default", "Default")
    .withConfiguration(complexityMetric, linesOfCodeMetric, Scales.availableScales[0])
    .withDescription(
        "Default risk analysis profile. Complexity as building footprint and lines of code as building" +
            " height provide a very good overview of the structure of your project. It should be easy to identify the " +
            "classes or packages with the highest risks. Change the building color to take a closer look at the " +
            "interesting parts."
    )
    .build();

const leakPeriod: Profile = new ProfileBuilder("leakPeriod", "Leak period")
    .withConfiguration(complexityMetric, newLinesOfCodeMetric, Scales.availableScales[0])
    .withDescription(
        "Check the quality of new code in the current leak period. It should be easy to identify the " +
            "changing parts of the system (high buildings) and to identify the parts with the most risk. Take a closer look " +
            "at the changing parts during the next release tests."
    )
    .build();

const duplicatedLinesOfCode: Profile = new ProfileBuilder(
    "duplicatedLinesOfCode",
    "Duplicated lines"
)
    .withConfiguration(complexityMetric, duplicatedLinesOfCodeMetric, Scales.availableScales[0])
    .withDescription(
        "Buildings only gain height if duplicated code is found within the class or file. Search for " +
            "hot spots of high buildings. High and massive buildings could contain complex duplicated code which is " +
            "a high risk especially if a lot of changes take place."
    )
    .build();

const custom: Profile = new ProfileBuilder("custom", "Customize")
    .withConfiguration(noMetric, noMetric, Scales.availableScales[0])
    .withDescription(
        "Select any metric using the 'Advanced options' tab at the top of this dialog."
    )
    .build();

export { defaultProfile, leakPeriod, duplicatedLinesOfCode, custom };

export class Profiles {
    public static availableProfiles: Profile[] = [
        defaultProfile,
        leakPeriod,
        duplicatedLinesOfCode,
        custom,
    ];

    public static getAvailableProfileById(id: string): Profile {
        for (const searchProfile of this.availableProfiles) {
            if (searchProfile.id === id) {
                return searchProfile;
            }
        }
        return custom;
    }
}
