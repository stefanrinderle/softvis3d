import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import BottomBarMetricInfo from "../../../src/components/bottombar/BottomBarMetricInfo";

describe("<BottomBarMetricInfo/>", () => {

    it("should show title and metric", () => {
        let title: string = "ExpectedTitle";
        let expectedMetricName: string = "ExpectedMetircName";

        let expectedMetric: Metric = {
            key: "123",
            type: "INT",
            name: expectedMetricName
        };

        const bottomBarMetricInfo = shallow(
            <BottomBarMetricInfo title={title} metric={expectedMetric}/>
        );

        expect(bottomBarMetricInfo.html().includes(expectedMetricName)).to.be.true;
        expect(bottomBarMetricInfo.html().includes(title)).to.be.true;
    });

});