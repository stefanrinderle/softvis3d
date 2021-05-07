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

export interface SonarQubeMeasurePagingResponse {
    baseComponent: SonarQubeApiComponent;
    components: SonarQubeApiComponent[];
    paging: SonarQubePaging;
}

export interface SonarQubeMeasureResponse {
    baseComponent: SonarQubeApiComponent;
    components: SonarQubeApiComponent[];
}

export interface SonarQubeApiComponent {
    key: string;
    language?: string;
    measures: SonarQubeMeasure[];
    name: string;
    path: string;
    qualifier: SonarQubeQualifier;
}

export interface SonarQubeMeasure {
    metric: string;
    value?: number;
    periods: SonarQubePeriod[];
}

export interface SonarQubePeriod {
    index: number;
    value: string;
}

export interface SonarQubePaging {
    pageIndex: number;
    pageSize: number;
    total: number;
}

/**
 * BRC - Sub-projects
 * DIR - Directories
 * FIL - Files
 * TRK - Projects
 * UTS - Unit Test Files
 */
export const SQ_QUALIFIER_DIRECTORY = "DIR";
export const SQ_QUALIFIER_FILE = "FIL";
export const SQ_QUALIFIER_UNIT_TEST_FILE = "UTS";
export const SQ_QUALIFIER_PROJECT = "TRK";
// not used yet
// export const SQ_QUALIFIER_SUB_PROJECT = "BRC";

// unfortunately, the const values can not be used here in the SonarQubeQualifier type.
export type SonarQubeQualifier = "BRC" | "DIR" | "FIL" | "TRK" | "UTS";
