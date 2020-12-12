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
import ScmCommitsCalculatorService from "../../../src/services/sonarqube/ScmCommitsCalculatorService";
import SonarQubeApiScm from "../../../src/services/sonarqube/SonarQubeApiScm";
import ComponentStatusStore from "../../../src/stores/ComponentStatusStore";
import { createMockInjection } from "../../Helper";
import { createDefaultTestComponentStatusStore } from "../../stores/ComponentStatusStore.spec";
import * as data from "./scmResponseExample.json";

describe("ScmCommitsCalculatorService", () => {
    it("should work with only one line and author", () => {
        createMockInjection(createDefaultTestComponentStatusStore());

        const measures: SonarQubeApiScm[] = [];
        const measure: SonarQubeApiScm = createMeasure(
            1,
            "f88a46527a9c09df19398f451c6571a8adf0e2c3"
        );
        measures.push(measure);

        const result = new ScmCommitsCalculatorService().calcNumberOfCommits(measures);

        expect(result).not.to.be.null;
        expect(result).to.be.eq(1);
    });

    it("should work with complex check", () => {
        createMockInjection(createDefaultTestComponentStatusStore());

        const measures: SonarQubeApiScm[] = [];
        measures.push(createMeasure(1, "f88a46527a9c09df19398f451c6571a8adf0e2c3"));
        measures.push(createMeasure(2, "f88a46527a9c09df19398f451c6571a8adf0e2c3"));
        measures.push(createMeasure(3, "5b5e9a43eac2acec3b87cb53d088e857a319f36c"));
        measures.push(createMeasure(4, "5b5e9a43eac2acec3b87cb53d088e857a319f36c"));
        measures.push(createMeasure(5, "f88a46527a9c09df19398f451c6571a8adf0e2c3"));
        measures.push(createMeasure(6, "5b5e9a43eac2acec3b87cb53d088e857a319f36c"));
        measures.push(createMeasure(7, "f88a46527a9c09df19398f451c6571a8adf0e2c3"));
        measures.push(createMeasure(8, "XX"));
        measures.push(createMeasure(9, "f88a46527a9c09df19398f451c6571a8adf0e2c3"));

        const result = new ScmCommitsCalculatorService().calcNumberOfCommits(measures);

        expect(result).to.be.eq(3);
    });

    it("should filter based on leak period date", () => {
        const componentStatusStore: ComponentStatusStore = createMockInjection(
            createDefaultTestComponentStatusStore()
        );
        componentStatusStore.leakPeriodDate = new Date("2020-01-01");

        const measures: SonarQubeApiScm[] = [];
        measures.push(createMeasure(1, "f88a465", "2017-01-11T19:06:26+0000"));
        measures.push(createMeasure(3, "5b5e9a4", "2020-01-11T19:06:26+0000"));
        measures.push(createMeasure(8, "XX", "2021-01-11T19:06:26+0000"));

        const result = new ScmCommitsCalculatorService().calcNumberOfCommits(measures);

        expect(result).to.be.eq(2);
    });

    it("should work with an empty array", () => {
        const measures: SonarQubeApiScm[] = [];

        const result = new ScmCommitsCalculatorService().calcNumberOfCommits(measures);

        expect(result).to.be.eq(0);
    });

    it("should work with example file ", () => {
        const componentStatusStore: ComponentStatusStore = createMockInjection(
            createDefaultTestComponentStatusStore()
        );
        componentStatusStore.leakPeriodDate = new Date("2017-01-12T20:04:34+0000");

        const input = prepareInputData();

        const underTest = new ScmCommitsCalculatorService();
        const result = underTest.calcNumberOfCommits(input);

        expect(result).to.be.eq(15);
    });
});

function prepareInputData(): SonarQubeApiScm[] {
    return data.scm.map((measure: any[]) => {
        return new SonarQubeApiScm(+measure[0], measure[1], measure[2], measure[3]);
    });
}

function createMeasure(line: number, revision: string, lastCommit = "2017-01-11T19:06:26+0000") {
    return new SonarQubeApiScm(line, "author", lastCommit, revision);
}
