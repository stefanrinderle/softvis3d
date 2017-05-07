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
export type SonarQubeQualifier =
    "BRC"
    | "DIR"
    | "FIL"
    | "TRK"
    | "UTS";
