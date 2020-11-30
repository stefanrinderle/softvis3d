import {
    SQ_QUALIFIER_FILE,
    SQ_QUALIFIER_UNIT_TEST_FILE
} from "../services/sonarqube/measures/api/SonarQubeMeasureResponse";

export class TreeElement {

    private static sortByNameAndType(a: TreeElement, b: TreeElement) {
        if (a.isFile() === b.isFile()) {
            return a.name.localeCompare(b.name);
        }

        return a.isFile() ? 1 : -1;
    }

    public readonly id: string;
    public readonly key: string;
    public measures: MeasureList;

    public name: string;
    public readonly path: string;

    public parent?: TreeElement;
    public readonly children: TreeElement[];

    public readonly qualifier: string;

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

    public isFile(): boolean {
        return (this.qualifier === SQ_QUALIFIER_FILE)
            || (this.qualifier === SQ_QUALIFIER_UNIT_TEST_FILE);
    }

    public getSortedChildren(): TreeElement[] {
        return this.children.sort(TreeElement.sortByNameAndType);
    }

    public replaceChildByKey(key: string, replaceChild: TreeElement) {
        for (let index = 0; index < this.children.length; index++) {
            if (key === this.children[index].key) {
                replaceChild.name = this.children[index].name + "/" + replaceChild.name;
                this.children[index] = replaceChild;
                break;
            }
        }
    }

    public clone(): TreeElement {
        const treeElement = new TreeElement(this.id, this.key, this.measures, this.name, this.path, this.qualifier, this.parent);

        for (let child of this.children) {
            treeElement.children.push(child.clone());
        }

        return treeElement;
    }
}