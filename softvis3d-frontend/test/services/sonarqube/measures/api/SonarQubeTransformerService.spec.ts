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
import { TreeElement } from "../../../../../src/classes/TreeElement";
import {
    SonarQubeApiComponent,
    SonarQubeMeasure,
    SonarQubeQualifier,
    SQ_QUALIFIER_DIRECTORY,
    SQ_QUALIFIER_FILE,
} from "../../../../../src/services/sonarqube/measures/api/SonarQubeMeasureResponse";
import SonarQubeTransformerService from "../../../../../src/services/sonarqube/measures/api/SonarQubeTransformerService";
import {
    createDefaultDir,
    createDefaultDirWithPath,
    createDefaultFileWithPath,
} from "../../../../classes/TreeElement.spec";

describe("SonarQubeTransformerService", () => {
    /**
     * createTreeElement tests.
     */

    it("should transform SQComponent to TreeElement - minimal", () => {
        const key = "key";
        const measures: SonarQubeMeasure[] = [];
        const name = "name";
        const path = "path";
        const qualifier: SonarQubeQualifier = SQ_QUALIFIER_DIRECTORY;

        const component: SonarQubeApiComponent = {
            key,
            measures,
            name,
            path,
            qualifier,
        };
        const result: TreeElement = new SonarQubeTransformerService().createTreeElement(component);

        expect(result).not.to.be.undefined;
        expect(result).not.to.be.null;

        expect(result.key).to.be.eq(key);
        expect(result.isFile()).to.be.eq(false);
        expect(result.children.length).to.be.eq(0);
        expect(result.path).to.be.eq(path);
        expect(result.name).to.be.eq(name);
        expect(result.key).to.be.eq(key);
        expect(result.parent).to.be.undefined;
    });

    it("should transform SQComponent to TreeElement - with parent", () => {
        const component: SonarQubeApiComponent = {
            key: "key",
            measures: [],
            name: "name",
            path: "path",
            qualifier: SQ_QUALIFIER_FILE,
        };

        const expectedParent: TreeElement = createDefaultDir();
        const result: TreeElement = new SonarQubeTransformerService().createTreeElement(
            component,
            expectedParent
        );

        expect(result.parent).not.to.be.undefined;
        expect(result.parent).not.to.be.null;

        expect(result.parent).to.be.eq(expectedParent);
    });

    it("should transform SQComponent to TreeElement - with measures", () => {
        const measures: SonarQubeMeasure[] = [];
        measures.push({
            metric: "ncloc",
            value: 123,
            periods: [],
        });
        measures.push({
            metric: "complexity",
            value: 321,
            periods: [],
        });

        const component: SonarQubeApiComponent = {
            key: "key",
            measures,
            name: "name",
            path: "path",
            qualifier: SQ_QUALIFIER_FILE,
        };

        const expectedParent: TreeElement = createDefaultDir();
        const result: TreeElement = new SonarQubeTransformerService().createTreeElement(
            component,
            expectedParent
        );

        expect(result.measures).not.to.be.undefined;
        expect(result.measures).not.to.be.null;

        expect(result.measures.ncloc).to.be.eq(123);
        expect(result.measures.complexity).to.be.eq(321);
    });

    it("should transform SQComponent to TreeElement - with period measures", () => {
        const index = 1;
        const value = "123";

        const measures: SonarQubeMeasure[] = [];
        measures.push({
            metric: "ncloc",
            periods: [
                {
                    index,
                    value,
                },
            ],
        });

        const component: SonarQubeApiComponent = {
            key: "key",
            measures,
            name: "name",
            path: "path",
            qualifier: SQ_QUALIFIER_FILE,
        };

        const expectedParent: TreeElement = createDefaultDir();
        const result: TreeElement = new SonarQubeTransformerService().createTreeElement(
            component,
            expectedParent
        );

        expect(result.measures).not.to.be.undefined;
        expect(result.measures).not.to.be.null;

        expect(result.measures.ncloc).to.be.eq(123);
    });

    /**
     * add tests.
     */

    it("should be able to add a child simple", () => {
        const parent: TreeElement = createTreeElementAsChildWithPath("/src");
        const child: TreeElement = createTreeElementAsChildWithPath("/src/file.java");

        new SonarQubeTransformerService().add(parent, child);

        expect(parent.children.length).to.be.eq(1);
        expect(parent.children[0]).to.be.eq(child);
    });

    it("should be able to add a child in subfolder", () => {
        const parent: TreeElement = createTreeElementAsChildWithPath("src");

        const subfolder: TreeElement = createTreeElementAsChildWithPath("src/sub");
        new SonarQubeTransformerService().add(parent, subfolder);

        const child: TreeElement = createTreeElementAsChildWithPath("src/sub/childFile.java");
        new SonarQubeTransformerService().add(parent, child);

        expect(parent.children.length).to.be.eq(1);
        expect(parent.children[0]).to.be.eq(subfolder);
        expect(parent.children[0].name).to.be.eq("sub");
        expect(parent.children[0].children.length).to.be.eq(1);
        expect(parent.children[0].children[0]).to.be.eq(child);
    });

    it("should be able to add a child - complex", () => {
        const parent: TreeElement = createTreeElementAsChildWithPath("src");

        const subfolder1: TreeElement = createTreeElementAsChildWithPath("src/sub");
        new SonarQubeTransformerService().add(parent, subfolder1);

        const subfolder2: TreeElement = createTreeElementAsChildWithPath("src/sub2");
        new SonarQubeTransformerService().add(parent, subfolder2);

        const child1: TreeElement = createTreeElementAsChildWithPath("src/sub/file.java");
        new SonarQubeTransformerService().add(parent, child1);

        const subfolder22: TreeElement = createTreeElementAsChildWithPath("src/sub2/sub22");
        new SonarQubeTransformerService().add(parent, subfolder22);

        const child22: TreeElement = createTreeElementAsChildWithPath("src/sub2/sub22/file.java");
        new SonarQubeTransformerService().add(parent, child22);

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
        const parent: TreeElement = createTreeElementAsChildWithPath("src");

        const subfolder1: TreeElement = createTreeElementAsChildWithPath("src/sub");
        new SonarQubeTransformerService().add(parent, subfolder1, true);

        const subfolder2: TreeElement = createTreeElementAsChildWithPath("src/sub2");
        new SonarQubeTransformerService().add(parent, subfolder2, true);

        const child1: TreeElement = createTreeElementAsChildWithPath("src/sub/file.java");
        new SonarQubeTransformerService().add(parent, child1, true);

        const subfolder22: TreeElement = createTreeElementAsChildWithPath("src/sub2/sub22");
        new SonarQubeTransformerService().add(parent, subfolder22, true);

        const child22: TreeElement = createTreeElementAsChildWithPath("src/sub2/sub22/file.java");
        new SonarQubeTransformerService().add(parent, child22, true);

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

function createTreeElementAsChildWithPath(path: string, isFile = false) {
    if (isFile) {
        return createDefaultFileWithPath(path);
    } else {
        return createDefaultDirWithPath(path);
    }
}
