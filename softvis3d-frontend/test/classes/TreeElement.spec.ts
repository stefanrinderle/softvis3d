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
import SonarQubeTransformer from "../../src/services/sonarqube/SonarQubeTransformer";

describe("TreeElement", () => {

    it("should be able to sort by name and type", () => {
        let parent: TreeElement = createTreeElementAsChildWithPath("/src");
        let testDir: TreeElement = createTreeElementAsChildWithPath("/src/test");
        SonarQubeTransformer.add(parent, testDir);

        let mainDir: TreeElement = createTreeElementAsChildWithPath("/src/main");
        SonarQubeTransformer.add(parent, mainDir);

        let fileA: TreeElement = createTreeElementAsChildWithPath("/src/a.java", true);
        SonarQubeTransformer.add(parent, fileA);
        let fileZ: TreeElement = createTreeElementAsChildWithPath("/src/z.java", true);
        SonarQubeTransformer.add(parent, fileZ);

        let folderResult: TreeElement[] = parent.getSortedChildren();

        expect(folderResult.length).to.be.eq(4);
        expect(folderResult[0].path).to.be.eq("/src/main");
        expect(folderResult[1].path).to.be.eq("/src/test");
        expect(folderResult[2].path).to.be.eq("/src/a.java");
        expect(folderResult[3].path).to.be.eq("/src/z.java");
    });

    it("should be able to replace child", () => {
        let parent: TreeElement = createTreeElementAsChildWithNameAndKey("/src", "123");
        SonarQubeTransformer.add(parent, createTreeElementAsChildWithNameAndKey("sdfsdf", "35"));
        SonarQubeTransformer.add(parent, createTreeElementAsChildWithNameAndKey("sdfs", "443"));

        let testDir: TreeElement = createTreeElementAsChildWithNameAndKey("/src/test", "333");
        SonarQubeTransformer.add(parent, testDir);

        let fileA: TreeElement = createTreeElementAsChildWithPath("/src/a.java", true);
        parent.replaceChildByKey("333", fileA);

        expect(parent.children[2]).to.be.eq(fileA);
    });

});

function createTreeElementAsChildWithPath(path: string, isFile: boolean = false) {
    return new TreeElement("", "", {}, "", path, isFile);
}

function createTreeElementAsChildWithNameAndKey(name: string, key: string) {
    return new TreeElement("", key, {}, name, "", false);
}