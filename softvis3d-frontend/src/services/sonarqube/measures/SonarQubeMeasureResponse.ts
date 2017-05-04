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
    qualifier: string;
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