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
import { linesOfCodeColorMetric, noColorMetric } from "../../src/constants/Metrics";
import {
    SQ_QUALIFIER_DIRECTORY,
    SQ_QUALIFIER_FILE,
    SQ_QUALIFIER_UNIT_TEST_FILE,
} from "../../src/services/sonarqube/measures/api/SonarQubeMeasureResponse";
import SonarQubeTransformerService from "../../src/services/sonarqube/measures/api/SonarQubeTransformerService";

describe("TreeElement", () => {
    const sonarQubeTransformerService = new SonarQubeTransformerService();

    it("should be able to sort by name and type", () => {
        const parent: TreeElement = createDefaultDirWithPath("/src");
        const testDir: TreeElement = createDefaultDirWithPath("/src/test");
        sonarQubeTransformerService.add(parent, testDir);

        const mainDir: TreeElement = createDefaultDirWithPath("/src/main");
        sonarQubeTransformerService.add(parent, mainDir);

        const fileA: TreeElement = createDefaultFileWithPath("/src/a1.java");
        sonarQubeTransformerService.add(parent, fileA);
        const fileZ: TreeElement = createDefaultFileWithPath("/src/z.java");
        sonarQubeTransformerService.add(parent, fileZ);

        const folderResult: TreeElement[] = parent.getSortedChildren();

        expect(folderResult.length).to.be.eq(4);
        expect(folderResult[0].path).to.be.eq("/src/main");
        expect(folderResult[1].path).to.be.eq("/src/test");
        expect(folderResult[2].path).to.be.eq("/src/a1.java");
        expect(folderResult[3].path).to.be.eq("/src/z.java");
    });

    it("should be able to replace child", () => {
        const parent: TreeElement = createDefaultDirWithKey("/src", "123");
        sonarQubeTransformerService.add(parent, createDefaultDirWithKey("sdfsdf", "35"));
        sonarQubeTransformerService.add(parent, createDefaultDirWithKey("sdfs", "443"));

        const testDir: TreeElement = createDefaultDirWithKey("/src/test", "333");
        sonarQubeTransformerService.add(parent, testDir);

        const fileA: TreeElement = createDefaultFileWithPath("/src/a.java");
        parent.replaceChildByKey("333", fileA);

        expect(parent.children[2]).to.be.eq(fileA);
    });

    it("should return measure value", () => {
        const parent: TreeElement = createDefaultDir();
        const exampleMetric = linesOfCodeColorMetric;

        const expectedValue = 123;
        parent.measures = {
            ncloc: expectedValue,
        };

        const result = parent.getMeasureValue(exampleMetric);
        expect(result).to.be.eq(expectedValue);
    });

    it("should return measure value", () => {
        const parent: TreeElement = createDefaultDir();

        const result = parent.getMeasureValue(noColorMetric);
        expect(result).to.be.null;
    });
});

/**
 * test methods to create tree elements for testing purposes.
 */

export function createDefaultFile() {
    return new TreeElement("", "", {}, "", "", SQ_QUALIFIER_FILE);
}

export function createDefaultTestFile() {
    return new TreeElement("", "", {}, "", "", SQ_QUALIFIER_UNIT_TEST_FILE);
}

export function createDefaultFileWithParent(parent: TreeElement) {
    return new TreeElement("", "", {}, "", "", SQ_QUALIFIER_FILE, parent);
}

export function createDefaultFileWithIdAndParent(id: string, parent?: TreeElement) {
    return new TreeElement(id, id, {}, id, "", SQ_QUALIFIER_FILE, parent);
}

export function createDefaultDirWithKeyAndParent(id: string, parent?: TreeElement) {
    return new TreeElement(id, id, {}, id, "", SQ_QUALIFIER_DIRECTORY, parent);
}

export function createDefaultFileWithName(name: string) {
    return new TreeElement(name, name, {}, name, "", SQ_QUALIFIER_FILE);
}

export function createDefaultDir() {
    return new TreeElement("", "", {}, "", "", SQ_QUALIFIER_DIRECTORY);
}

export function createDefaultFileWithPath(path: string) {
    return new TreeElement("", "", {}, "", path, SQ_QUALIFIER_FILE);
}

export function createDefaultDirWithPath(path: string) {
    return new TreeElement("", "", {}, "", path, SQ_QUALIFIER_DIRECTORY);
}

export function createDefaultDirWithKey(name: string, key: string) {
    return new TreeElement(key, key, {}, name, "", SQ_QUALIFIER_DIRECTORY);
}
