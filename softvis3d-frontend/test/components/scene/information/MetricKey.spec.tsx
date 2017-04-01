import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import MetricKey from "../../../../src/components/scene/information/MetricKey";
import Metric from "../../../../src/classes/Metric";

describe("<MetricKey/>", () => {

    it("should show title and metric", () => {
        let title: string = "ExpectedTitle";
        let expectedMetricName: string = "ExpectedMetricName";

        let expectedMetric: Metric = new Metric("123", "INT", expectedMetricName, "");

        const bottomBarMetricInfo = shallow(
            <MetricKey title={title} metric={expectedMetric} selectedElement={null}/>
        );

        expect(bottomBarMetricInfo.html()).to.include(expectedMetricName);
        expect(bottomBarMetricInfo.html()).to.include(title);
    });

    it("should show title and metric", () => {
        let title: string = "ExpectedTitle";
        let expectedMetricName: string = "ExpectedMetricName";

        let expectedMetric: Metric = new Metric("123", "INT", expectedMetricName, "");

        let expectedMeasure: number = 55;
        let selectedElement: TreeElement = {
            id: "",
            name: "",
            isNode: true,
            children: [],
            measures: {
                123: expectedMeasure
            },
            parentId: null
        };
        const bottomBarMetricInfo = shallow(
            <MetricKey title={title} metric={expectedMetric} selectedElement={selectedElement}/>
        );

        expect(bottomBarMetricInfo.html()).to.include(expectedMetricName);
        expect(bottomBarMetricInfo.html()).to.include(title);
        expect(bottomBarMetricInfo.html()).to.include(expectedMeasure);
    });

});