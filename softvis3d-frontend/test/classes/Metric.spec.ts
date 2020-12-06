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

import {expect} from "chai";
import Metric from "../../src/classes/Metric";
import {MetricType} from "../../src/classes/MetricType";

describe("Metric", () => {

    it("should construct minimal metric", () => {
        const expectedKey = "23";
        const expectedName = "diufgh";
        const expectedDescription = "description";
        const expectedType: MetricType = MetricType.INT;

        const result: Metric = new Metric(expectedKey, expectedName, expectedDescription, expectedType);

        expect(result.id).to.be.eq(expectedKey);
        expect(result.description).to.be.eq(expectedDescription);
        expect(result.type).to.be.eq(expectedType);
    });

    it("should implement SelectOptionValue", () => {
        const expectedId = "23";
        const expectedName = "diufgh";

        const result: Metric = new Metric(expectedId, expectedName, "isudiusdgf");

        expect(result.label).to.be.eq(expectedName);
        expect(result.id).to.be.eq(expectedId);
    });

});