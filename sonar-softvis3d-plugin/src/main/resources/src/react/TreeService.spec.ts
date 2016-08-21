import { expect } from "chai";
import { TreeElement } from "./TreeElement";
import { TreeService } from "./TreeService";

describe("TreeService", () => {

    it("should find tree node by id direct", () => {
        let id: string = "testId123";
        let tree: TreeElement = createTestTreeElement(id);

        TreeService.Instance.setTree(tree);

        let result: TreeElement = TreeService.Instance.searchTreeNode(id);

        expect(result.id).to.be.equal(tree.id);
    });

    it("should find tree node by id direct child", () => {
        let id: string = "testId123";
        let tree: TreeElement = createTestTreeElement("rootTreeId");

        tree.children.push(createTestTreeElement(id));

        TreeService.Instance.setTree(tree);

        let result: TreeElement = TreeService.Instance.searchTreeNode(id);

        expect(result.id).to.be.equal(id);
    });

    it("should find tree node by id direct child of child", () => {
        let id: string = "testId123";
        let tree: TreeElement = createTestTreeElement("rootTreeId");

        let child: TreeElement = createTestTreeElement("childTreeId");
        child.children.push(createTestTreeElement(id));

        tree.children.push(child);

        TreeService.Instance.setTree(tree);

        let result: TreeElement = TreeService.Instance.searchTreeNode(id);

        expect(result.id).to.be.equal(id);
    });

    it("should find all ids node by id direct", () => {
        let id: string = "testId123";
        let tree: TreeElement = createTestTreeElement(id);

        TreeService.Instance.setTree(tree);

        let result: string[] = TreeService.Instance.getAllSceneElementsRecursive(id);

        expect(result.length).to.be.equal(1);
        expect(result[0]).to.be.equal(id);
    });

    it("should return all elements with direct child - request child", () => {
        let id: string = "testId123";
        let tree: TreeElement = createTestTreeElement("rootTreeId");

        tree.children.push(createTestTreeElement(id));

        TreeService.Instance.setTree(tree);

        let result: string[] = TreeService.Instance.getAllSceneElementsRecursive(id);

        expect(result.length).to.be.equal(1);
        expect(result[0]).to.be.equal(id);
    });

    it("should return all elements with direct child - request root", () => {
        let id: string = "testId123";
        let rootId: string = "rootId123";
        let tree: TreeElement = createTestTreeElement(rootId);

        tree.children.push(createTestTreeElement(id));

        TreeService.Instance.setTree(tree);

        let result: string[] = TreeService.Instance.getAllSceneElementsRecursive(rootId);

        expect(result.length).to.be.equal(2);
        expect(result[0]).to.be.equal(rootId);
    });

    it("should return all elements with direct child of child", () => {
        let id: string = "testId123";
        let rootId: string = "rootId123";
        let tree: TreeElement = createTestTreeElement(rootId);

        let child: TreeElement = createTestTreeElement("childTreeId");
        child.children.push(createTestTreeElement(id));

        tree.children.push(child);

        TreeService.Instance.setTree(tree);

        let result: string[] = TreeService.Instance.getAllSceneElementsRecursive(rootId);

        expect(result.length).to.be.equal(3);
        expect(result[0]).to.be.equal(rootId);
    });
});

function createTestTreeElement(id: string): TreeElement {
    return {
        id: id,
        name: "",
        isNode: false,

        children: [],

        colorMetricValue: 0,
        footprintMetricValue: 0,
        heightMetricValue: 0,
        parentInfo: null
    };
}