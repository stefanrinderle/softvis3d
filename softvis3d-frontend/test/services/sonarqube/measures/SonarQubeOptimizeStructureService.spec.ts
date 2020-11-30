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
import SonarQubeOptimizeStructureService
    from "../../../../src/services/sonarqube/measures/structure/SonarQubeOptimizeStructureService";
import {createDefaultDir, createDefaultFile} from "../../../classes/TreeElement.spec";

describe("SonarQubeOptimizeStructureService", () => {

    /**
     * optimizeDirectoryStructure tests
     */

    it("should remove an empty dir as root child", () => {
        let underTest: SonarQubeOptimizeStructureService = new SonarQubeOptimizeStructureService();

        let root: TreeElement = createDefaultDir();
        let emptySubDir: TreeElement = createDefaultDir();
        root.children.push(emptySubDir);

        underTest.optimize(root);

        expect(root.children.length).to.be.eq(0);
    });

    it("should remove an multiple empty dirs", () => {
        let underTest: SonarQubeOptimizeStructureService = new SonarQubeOptimizeStructureService();

        let root: TreeElement = createDefaultDir();
        let emptySubDir: TreeElement = createDefaultDir();
        root.children.push(emptySubDir);
        let emptySubDir2: TreeElement = createDefaultDir();
        emptySubDir.children.push(emptySubDir2);

        underTest.optimize(root);

        expect(root.children.length).to.be.eq(0);
    });

    it("should remove an empty dir after not empty dir", () => {
        let underTest: SonarQubeOptimizeStructureService = new SonarQubeOptimizeStructureService();

        let root: TreeElement = createDefaultDir();
        let subDir: TreeElement = createDefaultDir();
        root.children.push(subDir);
        let file: TreeElement = createDefaultFile();
        subDir.children.push(file);
        let emptySubDir2: TreeElement = createDefaultDir();
        subDir.children.push(emptySubDir2);

        underTest.optimize(root);

        expect(root.children.length).to.be.eq(1);
        expect(root.children[0].children.length).to.be.eq(1);
    });

    it("should remove consecutive empty dirs", () => {
        let underTest: SonarQubeOptimizeStructureService = new SonarQubeOptimizeStructureService();

        let root: TreeElement = createDefaultDir();
        let subDir: TreeElement = createDefaultDir();
        subDir.parent = root;
        root.children.push(subDir);
        let subdir2: TreeElement = createDefaultDir();
        subdir2.parent = subDir;
        subDir.children.push(subdir2);
        let file: TreeElement = createDefaultFile();
        file.parent = subdir2;
        subdir2.children.push(file);

        underTest.optimize(root);

        expect(root.children.length).to.be.eq(1);
        expect(root.children[0].children[0]).to.be.eq(file);
    });

    it("should remove 2 empty dirs in the same folder", () => {
        let underTest: SonarQubeOptimizeStructureService = new SonarQubeOptimizeStructureService();

        let root: TreeElement = createDefaultDir();
        let subDir: TreeElement = createDefaultDir();
        subDir.parent = root;
        root.children.push(subDir);
        let subdir2: TreeElement = createDefaultDir();
        subdir2.parent = subDir;
        subDir.children.push(subdir2);
        let subdir3: TreeElement = createDefaultDir();
        subdir3.parent = subDir;
        subDir.children.push(subdir3);

        underTest.optimize(root);

        expect(root.children.length).to.be.eq(0);
    });
});