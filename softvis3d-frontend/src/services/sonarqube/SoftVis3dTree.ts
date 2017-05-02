import {SonarQubeApiComponent} from "./SonarQubeMeasuresService";

export class TreeElement {

    public static create(component: SonarQubeApiComponent, parent?: TreeElement): TreeElement {
        let measureList: MeasureList = {};

        for (let localMeasure of component.measures) {
            measureList[localMeasure.metric] = +localMeasure.value;
        }

        return new TreeElement(component.id, component.key, measureList, component.name, component.path,
            component.qualifier, parent);
    }

    public static createRoot(componentKey: string): TreeElement {
        return new TreeElement("", componentKey, {}, "", "", "");
    }

    public readonly id: string;
    public readonly key: string;
    public measures: MeasureList;

    public readonly name: string;
    public readonly path: string;

    public readonly parent?: TreeElement;
    public readonly children: TreeElement[];

    private qualifier: string;

    public constructor(id: string, key: string, measures: MeasureList, name: string, path: string, qualifier: string,
                       parent?: TreeElement) {
        this.id = id;
        this.key = key;
        this.measures = measures;
        this.name = name;
        this.path = path;
        this.qualifier = qualifier;
        this.parent = parent;
        this.children = [];
    }

    /**
     * BRC - Sub-projects
     * DIR - Directories
     * FIL - Files
     * TRK - Projects
     * UTS - Unit Test Files
     */
    public get isFile() {
        return this.qualifier === "FIL" || this.qualifier === "UTS";
    }

}