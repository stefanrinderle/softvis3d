export class TreeElement {

    public readonly id: string;
    public readonly key: string;
    public measures: MeasureList;

    public name: string;
    public readonly path: string;

    public parent?: TreeElement;
    public readonly children: TreeElement[];

    public isFile: boolean;

    public constructor(id: string, key: string, measures: MeasureList, name: string, path: string, isFile: boolean,
                       parent?: TreeElement) {
        this.id = id;
        this.key = key;
        this.measures = measures;
        this.name = name;
        this.path = path;
        this.isFile = isFile;
        this.parent = parent;
        this.children = [];
    }

    /**
     * Will be called with the path of the components sorted.
     */
    public addAsChild(element: TreeElement, isDescending: boolean = false) {
        let children = this.children;
        if (isDescending) {
            children = children.reverse();
        }

        for (let child of children) {
            let indexOf = element.path.indexOf(child.path + "/");

            if (indexOf === 0) {
                child.addAsChild(element, isDescending);
                return;
            }
        }

        if (!element.isFile) {
            let indexOf = element.path.indexOf(this.path + "/");
            if (indexOf === 0) {
                element.name = element.path.substr(this.path.length + 1, element.path.length);
            }
        }
        this.children.push(element);

        element.parent = this;
    }

}