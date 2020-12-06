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
import { shallow } from "enzyme";
import * as React from "react";
import Metric from "../../../../src/classes/Metric";
import { MetricType } from "../../../../src/classes/MetricType";
import { TreeElement } from "../../../../src/classes/TreeElement";
import MetricKey from "../../../../src/components/scene/information/MetricKey";
import { createDefaultFile } from "../../../classes/TreeElement.spec";

describe("<MetricKey/>", () => {
    it("should show title and metric", () => {
        const title = "ExpectedTitle";
        const expectedMetricName = "ExpectedMetricName";

        const expectedMetric: Metric = new Metric("123", expectedMetricName, "");

        const bottomBarMetricInfo = shallow(
            <MetricKey title={title} metric={expectedMetric} selectedElement={null} />
        );

        expect(bottomBarMetricInfo.html()).to.include(expectedMetricName);
        expect(bottomBarMetricInfo.html()).to.include(title);
    });

    it("should show title, metric and measure", () => {
        const title = "ExpectedTitle";
        const expectedMetricName = "ExpectedMetricName";

        const expectedMetric: Metric = new Metric("123", expectedMetricName, "");

        const expectedMeasure = 55;
        const selectedElement: TreeElement = createDefaultFile();
        selectedElement.measures = {
            123: expectedMeasure,
        };
        const bottomBarMetricInfo = shallow(
            <MetricKey title={title} metric={expectedMetric} selectedElement={selectedElement} />
        );

        expect(bottomBarMetricInfo.html()).to.include(expectedMetricName);
        expect(bottomBarMetricInfo.html()).to.include(title);
        expect(bottomBarMetricInfo.html()).to.include(expectedMeasure);
    });

    it("should format measure", () => {
        const expectedMetric: Metric = new Metric("123", "", "", MetricType.MILLISEC);

        const expectedMeasure = 1479816020000;
        const selectedElement: TreeElement = createDefaultFile();
        selectedElement.measures = {
            123: expectedMeasure,
        };
        const bottomBarMetricInfo = shallow(
            <MetricKey title={""} metric={expectedMetric} selectedElement={selectedElement} />
        );

        expect(bottomBarMetricInfo.html()).to.include("11");
        expect(bottomBarMetricInfo.html()).to.include("2016");
    });
});
