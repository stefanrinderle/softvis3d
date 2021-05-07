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

import { expect } from "chai";
import { TreeElement } from "../../src/classes/TreeElement";
import TreeService from "../../src/services/TreeService";
import { createDefaultFileWithIdAndParent } from "../classes/TreeElement.spec";

describe("TreeService", () => {
    it("should find tree node by key direct", () => {
        const key = "testId123";
        const tree: TreeElement = createTestTreeElement(key);

        const result = new TreeService().searchTreeNode(tree, key);

        expect(result).not.to.be.null;
        expect((result as TreeElement).key).to.be.equal(tree.key);
    });

    it("should find tree node by key direct child", () => {
        const key = "testId123";
        const tree: TreeElement = createTestTreeElement("rootTreeId");

        tree.children.push(createTestTreeElement(key));

        const result = new TreeService().searchTreeNode(tree, key);

        expect(result).not.to.be.null;
        expect((result as TreeElement).key).to.be.equal(key);
    });

    it("should find tree node by key direct child of child", () => {
        const key = "testId123";
        const tree: TreeElement = createTestTreeElement("rootTreeId");

        const child: TreeElement = createTestTreeElement("childTreeId");
        child.children.push(createTestTreeElement(key));

        tree.children.push(child);

        const result = new TreeService().searchTreeNode(tree, key);

        expect(result).not.to.be.null;
        expect((result as TreeElement).key).to.be.equal(key);
    });

    it("should find all ids node by key direct", () => {
        const key = "testId123";
        const tree: TreeElement = createTestTreeElement(key);

        const result: string[] = new TreeService().getAllSceneElementsRecursive(tree, key);

        expect(result.length).to.be.equal(1);
        expect(result[0]).to.be.equal(key);
    });

    it("should return all elements with direct child - request child", () => {
        const key = "testId123";
        const tree: TreeElement = createTestTreeElement("rootTreeId");

        tree.children.push(createTestTreeElement(key));

        const result: string[] = new TreeService().getAllSceneElementsRecursive(tree, key);

        expect(result).to.be.length(1);
        expect(result[0]).to.be.equal(key);
    });

    it("should return all elements with direct child - request root", () => {
        const key = "testId123";
        const rootId = "rootId123";
        const tree: TreeElement = createTestTreeElement(rootId);

        tree.children.push(createTestTreeElement(key));

        const result: string[] = new TreeService().getAllSceneElementsRecursive(tree, rootId);

        expect(result).to.be.length(2);
        expect(result[0]).to.be.equal(rootId);
    });

    it("should return all elements with direct child of child", () => {
        const key = "testId123";
        const rootId = "rootId123";
        const tree: TreeElement = createTestTreeElement(rootId);

        const child: TreeElement = createTestTreeElement("childTreeId");
        child.children.push(createTestTreeElement(key));

        tree.children.push(child);

        const result: string[] = new TreeService().getAllSceneElementsRecursive(tree, rootId);

        expect(result).to.be.length(3);
        expect(result[0]).to.be.equal(rootId);
    });

    it("should find not fail if the child node does not exist", () => {
        const key = "testId123";
        const tree: TreeElement = createTestTreeElement(key);

        const result = new TreeService().searchTreeNode(tree, "noId");

        expect(result).to.be.null;
    });

    it("should find not fail if the node does not exist in tree", () => {
        const key = "testId123";
        const tree: TreeElement = createTestTreeElement(key);

        tree.children.push(createTestTreeElement(key + "_1"));

        const result = new TreeService().getAllSceneElementsRecursive(tree, "noId");

        expect(result).to.be.length(0);
    });
});

function createTestTreeElement(key: string, parent?: TreeElement): TreeElement {
    return createDefaultFileWithIdAndParent(key, parent);
}
