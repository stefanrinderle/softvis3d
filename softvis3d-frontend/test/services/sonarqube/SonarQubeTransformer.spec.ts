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
import SonarQubeTransformer from "../../../src/services/sonarqube/SonarQubeTransformer";
import {
    SonarQubeApiComponent,
    SonarQubeMeasure, SonarQubeQualifier
} from "../../../src/services/sonarqube/measures/SonarQubeMeasureResponse";
import {TreeElement} from "../../../src/classes/TreeElement";

describe("SonarQubeTransformer", () => {

    it("should transform SQComponent to TreeElement - minimal", () => {
        let id = "id";
        let key = "key";
        let measures: SonarQubeMeasure[] = [];
        let name = "name";
        let path = "path";
        let qualifier: SonarQubeQualifier = "DIR";

        let component: SonarQubeApiComponent = {
            id,
            key,
            measures,
            name,
            path,
            qualifier
        };
        let result: TreeElement = SonarQubeTransformer.createTreeElement(component);

        expect(result).not.to.be.undefined;
        expect(result).not.to.be.null;

        expect(result.id).to.be.eq(id);
        expect(result.isFile).to.be.eq(false);
        expect(result.children.length).to.be.eq(0);
        expect(result.path).to.be.eq(path);
        expect(result.name).to.be.eq(name);
        expect(result.key).to.be.eq(key);
        expect(result.parent).to.be.undefined;
    });

    it("should transform SQComponent to TreeElement - with parent", () => {
        let component: SonarQubeApiComponent = {
            id: "id",
            key: "key",
            measures: [],
            name: "name",
            path: "path",
            qualifier: "FIL"
        };

        let expectedParent: TreeElement = new TreeElement("", "asdda", {}, "", "", false);
        let result: TreeElement = SonarQubeTransformer.createTreeElement(component, expectedParent);

        expect(result.parent).not.to.be.undefined;
        expect(result.parent).not.to.be.null;

        expect(result.parent).to.be.eq(expectedParent);
    });

    it("should transform SQComponent to TreeElement - with measures", () => {
        let measures: SonarQubeMeasure[] = [];
        measures.push({
            metric: "ncloc",
            value: 123,
            periods: []
        });
        measures.push({
            metric: "complexity",
            value: 321,
            periods: []
        });

        let component: SonarQubeApiComponent = {
            id: "id",
            key: "key",
            measures,
            name: "name",
            path: "path",
            qualifier: "FIL"
        };

        let expectedParent: TreeElement = new TreeElement("", "asdda", {}, "", "", false);
        let result: TreeElement = SonarQubeTransformer.createTreeElement(component, expectedParent);

        expect(result.measures).not.to.be.undefined;
        expect(result.measures).not.to.be.null;

        expect(result.measures.ncloc).to.be.eq(123);
        expect(result.measures.complexity).to.be.eq(321);
    });

    it("should transform SQComponent to TreeElement - with period measures", () => {
        let index: number = 1;
        let value: string = "123";

        let measures: SonarQubeMeasure[] = [];
        measures.push({
            metric: "ncloc",
            periods: [{
                index,
                value
            }]
        });

        let component: SonarQubeApiComponent = {
            id: "id",
            key: "key",
            measures,
            name: "name",
            path: "path",
            qualifier: "FIL"
        };

        let expectedParent: TreeElement = new TreeElement("", "asdda", {}, "", "", false);
        let result: TreeElement = SonarQubeTransformer.createTreeElement(component, expectedParent);

        expect(result.measures).not.to.be.undefined;
        expect(result.measures).not.to.be.null;

        expect(result.measures.ncloc).to.be.eq(123);
    });

});