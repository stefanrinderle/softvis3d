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
import { ExcludeFileFilter, IncludeFileFilter } from "../../src/classes/StringFileFilter";
import { createDefaultFileWithName } from "./TreeElement.spec";

describe("StringFileFilter", () => {
    const testFile = createDefaultFileWithName("SoftVis.java");

    it("should not filter by default - include", () => {
        const underTestInclude = new IncludeFileFilter();

        expect(underTestInclude.shouldRemoveFile(testFile)).to.be.false;
    });

    it("should filter not matching - include", () => {
        const underTestInclude = new IncludeFileFilter();
        underTestInclude.value = ".*.pom";
        expect(underTestInclude.shouldRemoveFile(testFile)).to.be.true;
    });

    it("should not filter matching - include", () => {
        const underTestInclude = new IncludeFileFilter();
        underTestInclude.value = ".*.java";
        expect(underTestInclude.shouldRemoveFile(testFile)).to.be.false;
    });

    it("should not filter by default - exclude", () => {
        const underTestInclude = new ExcludeFileFilter();

        expect(underTestInclude.shouldRemoveFile(testFile)).to.be.false;
    });

    it("should not filter not matching - exclude", () => {
        const underTestInclude = new ExcludeFileFilter();
        underTestInclude.value = ".*.pom";
        expect(underTestInclude.shouldRemoveFile(testFile)).to.be.false;
    });

    it("should filter matching - exclude", () => {
        const underTestInclude = new ExcludeFileFilter();
        underTestInclude.value = ".*.java";
        expect(underTestInclude.shouldRemoveFile(testFile)).to.be.true;
    });
});
