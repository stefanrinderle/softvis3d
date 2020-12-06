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
import FileFilter from "../../src/classes/FileFilter";
import { ONLY_TEST_CLASSES_VARIANT } from "../../src/constants/TestClassesVariants";
import { createDefaultFileWithName } from "./TreeElement.spec";

describe("FileFilter", () => {
    const testFile = createDefaultFileWithName("SoftVis.java");

    it("should not filter by default", () => {
        const underTest = new FileFilter();

        expect(underTest.shouldRemoveFile(testFile)).to.be.false;
    });

    it("should filter not matching - include", () => {
        const underTest = new FileFilter();
        underTest.includeClasses.value = ".*.pom";
        expect(underTest.shouldRemoveFile(testFile)).to.be.true;
    });

    it("should filter not matching - test class variant", () => {
        const underTest = new FileFilter();
        underTest.testClassesVariant = ONLY_TEST_CLASSES_VARIANT;
        expect(underTest.shouldRemoveFile(testFile)).to.be.true;
    });

    it("should filter matching - exclude", () => {
        const underTest = new FileFilter();
        underTest.excludeClasses.value = ".*.java";
        expect(underTest.shouldRemoveFile(testFile)).to.be.true;
    });
});
