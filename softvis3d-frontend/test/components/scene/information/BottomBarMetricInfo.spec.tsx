import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import MetricKey from "../../../../src/components/scene/information/MetricKey";

describe("<MetricKey/>", () => {

    it("should show title and metric", () => {
        let title: string = "ExpectedTitle";
        let expectedMetricName: string = "ExpectedMetricName";

        let expectedMetric: Metric = {
            key: "123",
            type: "INT",
            name: expectedMetricName
        };

        const bottomBarMetricInfo = shallow(
            <MetricKey title={title} metric={expectedMetric} selectedElement={null}/>
        );

        expect(bottomBarMetricInfo.html()).to.include(expectedMetricName);
        expect(bottomBarMetricInfo.html()).to.include(title);
    });

});