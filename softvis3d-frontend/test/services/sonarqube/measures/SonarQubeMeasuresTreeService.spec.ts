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

import { assert, expect } from "chai";
import { TreeElement } from "../../../../src/classes/TreeElement";
import {
    SonarQubeApiComponent,
    SonarQubeMeasureResponse,
    SQ_QUALIFIER_DIRECTORY,
    SQ_QUALIFIER_FILE,
} from "../../../../src/services/sonarqube/measures/api/SonarQubeMeasureResponse";
import SonarQubeMeasuresApiService from "../../../../src/services/sonarqube/measures/api/SonarQubeMeasuresApiService";
import SonarQubeMeasuresTreeService from "../../../../src/services/sonarqube/measures/api/SonarQubeMeasuresTreeService";
import SonarQubeTransformerService from "../../../../src/services/sonarqube/measures/api/SonarQubeTransformerService";
import { createDefaultDir } from "../../../classes/TreeElement.spec";
import { createMock } from "../../../Helper";

describe("SonarQubeMeasuresTreeService", () => {
    it("should immediately resolve on response without components", (done) => {
        const measureApiService = createMock(SonarQubeMeasuresApiService);
        createMock(SonarQubeTransformerService);

        const underTest: SonarQubeMeasuresTreeService = new SonarQubeMeasuresTreeService();

        measureApiService.loadMeasures.returns(Promise.resolve(createResponseWithComponents([])));

        const root: TreeElement = createDefaultDir();
        underTest
            .loadTree(root, "metricKeys")
            .then(() => {
                assert(measureApiService.loadMeasures.called);

                done();
            })
            .catch((error) => {
                assert.isNotOk(error, "Promise error");
                done();
            });
    });

    it("should resolve result", (done) => {
        const measureApiService = createMock(SonarQubeMeasuresApiService);
        const sonarQubeTransformerService = createMock(SonarQubeTransformerService);
        sonarQubeTransformerService.createTreeElement.callThrough();
        sonarQubeTransformerService.add.callThrough();

        const underTest: SonarQubeMeasuresTreeService = new SonarQubeMeasuresTreeService();

        const defaultComponent: SonarQubeApiComponent = {
            id: "1",
            key: "1",
            measures: [],
            name: "string",
            path: "string/bla.txt",
            qualifier: SQ_QUALIFIER_FILE,
        };
        const defaultDir: SonarQubeApiComponent = {
            id: "1",
            key: "1",
            measures: [],
            name: "string",
            path: "string",
            qualifier: SQ_QUALIFIER_DIRECTORY,
        };
        measureApiService.loadMeasures.returns(
            Promise.resolve(createResponseWithComponents([defaultComponent, defaultDir]))
        );

        const root: TreeElement = createDefaultDir();
        underTest
            .loadTree(root, "metricKeys")
            .then(() => {
                assert(measureApiService.loadMeasures.called);
                expect(root.children.length).to.be.eq(2);

                done();
            })
            .catch((error) => {
                assert.isNotOk(error, "Promise error");
                done();
            });
    });

    it("should call service and react on errors", (done) => {
        const measureApiService = createMock(SonarQubeMeasuresApiService);

        const underTest: SonarQubeMeasuresTreeService = new SonarQubeMeasuresTreeService();

        measureApiService.loadMeasures.returns(
            Promise.reject({
                response: {
                    statusText: "not working",
                },
            })
        );

        const root: TreeElement = createDefaultDir();
        underTest
            .loadTree(root, "metricKeys")
            .then(() => {
                assert.isNotOk("Promise error", "works but should throw exception");

                done();
            })
            .catch((error) => {
                expect(error.response.statusText).to.be.eq("not working");
                done();
            });
    });
});

function createResponseWithComponents(
    components: SonarQubeApiComponent[]
): SonarQubeMeasureResponse {
    return {
        baseComponent: {
            id: "",
            key: "",
            measures: [],
            name: "",
            path: "",
            qualifier: SQ_QUALIFIER_DIRECTORY,
        },
        components,
    };
}
