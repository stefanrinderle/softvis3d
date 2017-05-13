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
    id: string;
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
export const SQ_QUALIFIER_SUB_PROJECT = "BRC";
export const SQ_QUALIFIER_DIRECTORY = "DIR";
export const SQ_QUALIFIER_FILE = "FIL";
// not used yet
// export const SQ_QUALIFIER_PROJECT = "TRK";
export const SQ_QUALIFIER_UNIT_TEST_FILE = "UTS";

// unfortunately, the const values can not be used here in the SonarQubeQualifier type.
export type SonarQubeQualifier =
    "BRC"
    | "DIR"
    | "FIL"
    | "TRK"
    | "UTS";
