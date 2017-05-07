///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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
import {expect} from "chai";
import {TreeElement} from "../../src/classes/TreeElement";

describe("TreeElement", () => {

    it("should be able to add a child simple", () => {
        let parent: TreeElement = createTreeElementAsChildWithPath("/src");
        let child: TreeElement = createTreeElementAsChildWithPath("/src/file.java");

        parent.add(child);

        expect(parent.children.length).to.be.eq(1);
        expect(parent.children[0]).to.be.eq(child);
    });

    it("should be able to add a child in subfolder", () => {
        let parent: TreeElement = createTreeElementAsChildWithPath("src");

        let subfolder: TreeElement = createTreeElementAsChildWithPath("src/sub");
        parent.add(subfolder);

        let child: TreeElement = createTreeElementAsChildWithPath("src/sub/file.java");
        parent.add(child);

        expect(parent.children.length).to.be.eq(1);
        expect(parent.children[0]).to.be.eq(subfolder);
        expect(parent.children[0].name).to.be.eq("sub");
        expect(parent.children[0].children.length).to.be.eq(1);
        expect(parent.children[0].children[0]).to.be.eq(child);
    });

    it("should be able to add a child - complex", () => {
        let parent: TreeElement = createTreeElementAsChildWithPath("src");

        let subfolder1: TreeElement = createTreeElementAsChildWithPath("src/sub");
        parent.add(subfolder1);

        let subfolder2: TreeElement = createTreeElementAsChildWithPath("src/sub2");
        parent.add(subfolder2);

        let child1: TreeElement = createTreeElementAsChildWithPath("src/sub/file.java");
        parent.add(child1);

        let subfolder22: TreeElement = createTreeElementAsChildWithPath("src/sub2/sub22");
        parent.add(subfolder22);

        let child22: TreeElement = createTreeElementAsChildWithPath("src/sub2/sub22/file.java");
        parent.add(child22);

        expect(parent.children.length).to.be.eq(2);
        expect(parent.children[0]).to.be.eq(subfolder1);
        expect(parent.children[0].children.length).to.be.eq(1);
        expect(parent.children[0].children[0]).to.be.eq(child1);

        expect(parent.children[1]).to.be.eq(subfolder2);
        expect(parent.children[1].children.length).to.be.eq(1);
        expect(parent.children[1].children[0]).to.be.eq(subfolder22);
        expect(parent.children[1].children[0].children[0]).to.be.eq(child22);
    });

    it("should be able to add a child - complex descending", () => {
        let parent: TreeElement = createTreeElementAsChildWithPath("src");

        let subfolder1: TreeElement = createTreeElementAsChildWithPath("src/sub");
        parent.add(subfolder1, true);

        let subfolder2: TreeElement = createTreeElementAsChildWithPath("src/sub2");
        parent.add(subfolder2, true);

        let child1: TreeElement = createTreeElementAsChildWithPath("src/sub/file.java");
        parent.add(child1, true);

        let subfolder22: TreeElement = createTreeElementAsChildWithPath("src/sub2/sub22");
        parent.add(subfolder22, true);

        let child22: TreeElement = createTreeElementAsChildWithPath("src/sub2/sub22/file.java");
        parent.add(child22, true);

        expect(parent.children.length).to.be.eq(2);
        expect(parent.children[0]).to.be.eq(subfolder1);
        expect(parent.children[0].children.length).to.be.eq(1);
        expect(parent.children[0].children[0]).to.be.eq(child1);

        expect(parent.children[1]).to.be.eq(subfolder2);
        expect(parent.children[1].children.length).to.be.eq(1);
        expect(parent.children[1].children[0]).to.be.eq(subfolder22);
        expect(parent.children[1].children[0].children[0]).to.be.eq(child22);
    });

});

function createTreeElementAsChildWithPath(path: string) {
    return new TreeElement("", "", {}, "", path, false);
}