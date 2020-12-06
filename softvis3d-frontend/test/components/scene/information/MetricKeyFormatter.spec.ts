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
import MetricKeyFormatter from "../../../../src/components/scene/information/MetricKeyFormatter";
import Metric from "../../../../src/classes/Metric";
import { MetricType } from "../../../../src/classes/MetricType";

describe("MetricKeyFormatter", () => {
    it("should convert to string on integer", () => {
        const metric = new Metric("", "", "", MetricType.INT);
        const value = 347436;

        const result: string = MetricKeyFormatter.formatMeasureValue(metric, value);

        expect(result).to.be.eq(value + "");
    });

    it("should convert to date on milliseconds", () => {
        const metric = new Metric("", "", "", MetricType.MILLISEC);
        const value = 1479816020000;

        const result: string = MetricKeyFormatter.formatMeasureValue(metric, value);

        expect(result).to.contain("11");
        expect(result).to.contain("2016");
    });

    it("should return empty string on undefined value", () => {
        const metric = new Metric("", "", "", MetricType.MILLISEC);
        let value;

        const result: string = MetricKeyFormatter.formatMeasureValue(metric, value);

        expect(result).to.be.eq("n/a");
    });
});
