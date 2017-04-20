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
import ScmCalculator from "../../../src/services/sonarqube/ScmCalculator";
import SonarQubeApiScm from "../../../src/services/sonarqube/SonarQubeApiScm";

describe("ScmCalculator", () => {

    it("should work with only one line and author", () => {
        let measures: SonarQubeApiScm[] = [];
        let measure: SonarQubeApiScm = createMeasure(1, "srinderle");
        measures.push(measure);

        let result = ScmCalculator.calcNumberOfAuthors(measures);

        expect(result).not.to.be.null;
        expect(result).to.be.eq(1);
    });

    it("should work with complex check", () => {
        let measures: SonarQubeApiScm[] = [];
        measures.push(createMeasure(1, "srinderle"));
        measures.push(createMeasure(2, "srinderle"));
        measures.push(createMeasure(3, "yniedrich"));
        measures.push(createMeasure(4, "yniedrich"));
        measures.push(createMeasure(5, "srinderle"));
        measures.push(createMeasure(6, "yniedrich"));
        measures.push(createMeasure(7, "srinderle"));
        measures.push(createMeasure(8, "XX"));
        measures.push(createMeasure(9, "srinderle"));

        let result = ScmCalculator.calcNumberOfAuthors(measures);

        expect(result).to.be.eq(3);
    });

    it("should work with an empty array", () => {
        let measures: SonarQubeApiScm[] = [];

        let result = ScmCalculator.calcNumberOfAuthors(measures);

        expect(result).to.be.eq(0);
    });

    it("should create metric based on inut array", () => {
        let measure: string[] = [];
        let lineNumber = "1";
        let authorName = "srinderle";
        let lastCommit = "dofighodifg";
        let lastCommitRevision = "idufghidugh";

        measure[0] = lineNumber;
        measure[1] = authorName;
        measure[2] = lastCommit;
        measure[3] = lastCommitRevision;

        let result = ScmCalculator.createMetric(measure);

        expect(result.lineNumber).to.be.eq(+lineNumber);
        expect(result.authorName).to.be.eq(authorName);
        expect(result.lastCommit).to.be.eq(lastCommit);
        expect(result.lastCommitRevision).to.be.eq(lastCommitRevision);
    });

});

function createMeasure(line: number, author: string) {
    return new SonarQubeApiScm(line, author, "sdhufisudf", "dsiuhfidsufh");
}