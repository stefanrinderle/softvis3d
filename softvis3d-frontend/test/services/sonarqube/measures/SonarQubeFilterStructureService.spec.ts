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
import {TreeElement} from "../../../../src/classes/TreeElement";
import SonarQubeFilterStructureService
    from "../../../../src/services/sonarqube/measures/structure/SonarQubeFilterStructureService";
import CityBuilderStore from "../../../../src/stores/CityBuilderStore";
import {
    createDefaultDir,
    createDefaultFile,
    createDefaultFileWithName,
    createDefaultTestFile
} from "../../../classes/TreeElement.spec";

describe("SonarQubeFilterStructureService", () => {

    it("should remove an UTS file", () => {
        let underTest: SonarQubeFilterStructureService = new SonarQubeFilterStructureService();

        let root: TreeElement = createDefaultDir();
        let file: TreeElement = createDefaultFile();
        root.children.push(file);
        let utsFile: TreeElement = createDefaultTestFile();
        root.children.push(utsFile);

        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        underTest.filter(root, testCityBuilderStore);

        expect(root.children.length).to.be.eq(1);
    });

    it("should remove multiple UTS files", () => {
        let underTest: SonarQubeFilterStructureService = new SonarQubeFilterStructureService();

        let root: TreeElement = createDefaultDir();
        let utsFile1: TreeElement = createDefaultTestFile();
        root.children.push(utsFile1);
        let utsFile2: TreeElement = createDefaultTestFile();
        root.children.push(utsFile2);

        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        underTest.filter(root, testCityBuilderStore);

        expect(root.children.length).to.be.eq(0);
    });

    it("should remove UTS files in mixed structure", () => {
        let underTest: SonarQubeFilterStructureService = new SonarQubeFilterStructureService();

        let root: TreeElement = createDefaultDir();
        let srcDir: TreeElement = createDefaultDir();
        let srcFile1: TreeElement = createDefaultFile();
        srcDir.children.push(srcFile1);
        let srcFile2: TreeElement = createDefaultFile();
        srcDir.children.push(srcFile2);
        root.children.push(srcDir);

        let testDir: TreeElement = createDefaultDir();
        let utsFile1: TreeElement = createDefaultTestFile();
        testDir.children.push(utsFile1);
        let utsFile2: TreeElement = createDefaultTestFile();
        testDir.children.push(utsFile2);
        root.children.push(testDir);

        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        underTest.filter(root, testCityBuilderStore);

        expect(root.children.length).to.be.eq(2);
        expect(srcDir.children.length).to.be.eq(2);
        expect(testDir.children.length).to.be.eq(0);
    });

    it("should remove an excluded file", () => {
        let underTest: SonarQubeFilterStructureService = new SonarQubeFilterStructureService();

        const expectedName = "SonarQube.java";
        let root: TreeElement = createDefaultDir();
        let file: TreeElement = createDefaultFileWithName(expectedName);
        root.children.push(file);
        let utsFile: TreeElement = createDefaultFileWithName("pom.xml");
        root.children.push(utsFile);

        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        testCityBuilderStore.options.fileFilter.excludeClasses.value = ".*.xml";

        underTest.filter(root, testCityBuilderStore);

        expect(root.children.length).to.be.eq(1);
        expect(root.children[0].name).to.be.eq(expectedName);
    });

});