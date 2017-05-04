export class TreeElement {

    public readonly id: string;
    public readonly key: string;
    public measures: MeasureList;

    public readonly name: string;
    public readonly path: string;

    public parent?: TreeElement;
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

    /**
     * Will be called with the path of the components sorted.
     */
    public addAsChild(element: TreeElement, isDescending: boolean = false) {
        if (this.children.length === 0) {
            this.children.push(element);
        } else {
            let children = this.children;
            if (isDescending) {
                children = children.reverse();
            }

            for (let child of children) {
                let indexOf = element.path.indexOf(child.path + "/");
                if (indexOf === 0) {
                    child.addAsChild(element);
                    return;
                }
            }
            this.children.push(element);
        }

        element.parent = this;
    }

}