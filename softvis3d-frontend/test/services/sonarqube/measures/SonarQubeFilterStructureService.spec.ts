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
import { TreeElement } from "../../../../src/classes/TreeElement";
import SonarQubeFilterStructureService from "../../../../src/services/sonarqube/measures/structure/SonarQubeFilterStructureService";
import CityBuilderStore from "../../../../src/stores/CityBuilderStore";
import {
    createDefaultDir,
    createDefaultFile,
    createDefaultFileWithName,
    createDefaultTestFile,
} from "../../../classes/TreeElement.spec";
import { createMockInjection } from "../../../Helper";

describe("SonarQubeFilterStructureService", () => {
    it("should remove an UTS file", () => {
        const underTest: SonarQubeFilterStructureService = new SonarQubeFilterStructureService();

        const root: TreeElement = createDefaultDir();
        const file: TreeElement = createDefaultFile();
        root.children.push(file);
        const utsFile: TreeElement = createDefaultTestFile();
        root.children.push(utsFile);

        createMockInjection(new CityBuilderStore());

        underTest.filter(root);

        expect(root.children.length).to.be.eq(1);
    });

    it("should remove multiple UTS files", () => {
        const underTest: SonarQubeFilterStructureService = new SonarQubeFilterStructureService();

        const root: TreeElement = createDefaultDir();
        const utsFile1: TreeElement = createDefaultTestFile();
        root.children.push(utsFile1);
        const utsFile2: TreeElement = createDefaultTestFile();
        root.children.push(utsFile2);

        createMockInjection(new CityBuilderStore());

        underTest.filter(root);

        expect(root.children.length).to.be.eq(0);
    });

    it("should remove UTS files in mixed structure", () => {
        const underTest: SonarQubeFilterStructureService = new SonarQubeFilterStructureService();

        const root: TreeElement = createDefaultDir();
        const srcDir: TreeElement = createDefaultDir();
        const srcFile1: TreeElement = createDefaultFile();
        srcDir.children.push(srcFile1);
        const srcFile2: TreeElement = createDefaultFile();
        srcDir.children.push(srcFile2);
        root.children.push(srcDir);

        const testDir: TreeElement = createDefaultDir();
        const utsFile1: TreeElement = createDefaultTestFile();
        testDir.children.push(utsFile1);
        const utsFile2: TreeElement = createDefaultTestFile();
        testDir.children.push(utsFile2);
        root.children.push(testDir);

        createMockInjection(new CityBuilderStore());

        underTest.filter(root);

        expect(root.children.length).to.be.eq(2);
        expect(srcDir.children.length).to.be.eq(2);
        expect(testDir.children.length).to.be.eq(0);
    });

    it("should remove an excluded file", () => {
        const underTest: SonarQubeFilterStructureService = new SonarQubeFilterStructureService();

        const expectedName = "SonarQube.java";
        const root: TreeElement = createDefaultDir();
        const file: TreeElement = createDefaultFileWithName(expectedName);
        root.children.push(file);
        const utsFile: TreeElement = createDefaultFileWithName("pom.xml");
        root.children.push(utsFile);

        const testCityBuilderStore: CityBuilderStore = createMockInjection(new CityBuilderStore());
        testCityBuilderStore.options.fileFilter.excludeClasses.value = ".*.xml";

        underTest.filter(root);

        expect(root.children.length).to.be.eq(1);
        expect(root.children[0].name).to.be.eq(expectedName);
    });
});
