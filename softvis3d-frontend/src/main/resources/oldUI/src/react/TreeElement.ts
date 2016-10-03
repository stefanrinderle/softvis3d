export interface TreeElement {
    id: string;
    name: string;
    isNode: boolean;

    children: TreeElement[];

    colorMetricValue: number;
    footprintMetricValue: number;
    heightMetricValue: number;
    parentInfo: TreeElement;
}