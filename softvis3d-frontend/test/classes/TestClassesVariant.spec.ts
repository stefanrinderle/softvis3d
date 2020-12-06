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
import {
    NoTestClassesVariant,
    OnlyTestClassesVariant,
    WithTestClassesVariant,
} from "../../src/classes/TestClassesVariant";
import { createDefaultFile, createDefaultTestFile } from "./TreeElement.spec";

describe("TestClassesVariant", () => {
    it("should create NoTestClassesVariant with expected values", () => {
        const underTest = new NoTestClassesVariant();

        expect(underTest.id).to.be.eq("no");
        expect(underTest.label).to.be.eq("No test classes");
    });

    it("should create WithTestClassesVariant with expected values", () => {
        const underTest = new WithTestClassesVariant();

        expect(underTest.id).to.be.eq("with");
        expect(underTest.label).to.be.eq("With test classes");
    });

    it("should create OnlyTestClassesVariant with expected values", () => {
        const underTest = new OnlyTestClassesVariant();

        expect(underTest.id).to.be.eq("only");
        expect(underTest.label).to.be.eq("Only test classes");
    });

    it("should filter sq file", () => {
        const underTestNo = new NoTestClassesVariant();
        const underTestWith = new WithTestClassesVariant();
        const underTestOnly = new OnlyTestClassesVariant();

        const file = createDefaultFile();

        expect(underTestNo.shouldRemoveFile(file)).to.be.false;
        expect(underTestWith.shouldRemoveFile()).to.be.false;
        expect(underTestOnly.shouldRemoveFile(file)).to.be.true;
    });

    it("should filter sq unit test file", () => {
        const underTestNo = new NoTestClassesVariant();
        const underTestWith = new WithTestClassesVariant();
        const underTestOnly = new OnlyTestClassesVariant();

        const file = createDefaultTestFile();

        expect(underTestNo.shouldRemoveFile(file)).to.be.true;
        expect(underTestWith.shouldRemoveFile()).to.be.false;
        expect(underTestOnly.shouldRemoveFile(file)).to.be.false;
    });
});
