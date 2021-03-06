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
import ScmAuthorsCalculatorService from "../../../../src/services/sonarqube/scm/ScmAuthorsCalculatorService";
import SonarQubeApiScm from "../../../../src/services/sonarqube/SonarQubeApiScm";

describe("ScmAuthorsCalculatorService", () => {
    it("should work with only one line and author", () => {
        const measures: SonarQubeApiScm[] = [];
        const measure: SonarQubeApiScm = createMeasure(1, "srinderle");
        measures.push(measure);

        const result = new ScmAuthorsCalculatorService().calcNumberOfAuthors(measures);

        expect(result).not.to.be.null;
        expect(result).to.be.eq(1);
    });

    it("should work with complex check", () => {
        const measures: SonarQubeApiScm[] = [];
        measures.push(createMeasure(1, "srinderle"));
        measures.push(createMeasure(2, "srinderle"));
        measures.push(createMeasure(3, "yniedrich"));
        measures.push(createMeasure(4, "yniedrich"));
        measures.push(createMeasure(5, "srinderle"));
        measures.push(createMeasure(6, "yniedrich"));
        measures.push(createMeasure(7, "srinderle"));
        measures.push(createMeasure(8, "XX"));
        measures.push(createMeasure(9, "srinderle"));

        const result = new ScmAuthorsCalculatorService().calcNumberOfAuthors(measures);

        expect(result).to.be.eq(3);
    });

    it("should work with an empty array", () => {
        const measures: SonarQubeApiScm[] = [];

        const result = new ScmAuthorsCalculatorService().calcNumberOfAuthors(measures);

        expect(result).to.be.eq(0);
    });
});

function createMeasure(line: number, author: string) {
    return new SonarQubeApiScm(line, author, "sdhufisudf", "dsiuhfidsufh");
}
