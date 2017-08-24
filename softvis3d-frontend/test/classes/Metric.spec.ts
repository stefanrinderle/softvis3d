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
import Metric from "../../src/classes/Metric";
import {MetricType} from "../../src/classes/MetricType";

describe("Metric", () => {

    it("should construct minimal metric", () => {
        let expectedKey: string = "23";
        let expectedName: string = "diufgh";
        let expectedDescription: string = "description";
        let expectedType: MetricType = MetricType.INT;

        let result: Metric = new Metric(expectedKey, expectedName, expectedDescription, expectedType);

        expect(result.id).to.be.eq(expectedKey);
        expect(result.description).to.be.eq(expectedDescription);
        expect(result.type).to.be.eq(expectedType);
    });

    it("should implement SelectOptionValue", () => {
        let expectedId: string = "23";
        let expectedName: string = "diufgh";

        let result: Metric = new Metric(expectedId, expectedName, "isudiusdgf");

        expect(result.label).to.be.eq(expectedName);
        expect(result.id).to.be.eq(expectedId);
    });

});