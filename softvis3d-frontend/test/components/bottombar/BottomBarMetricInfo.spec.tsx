import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import BottomBarMetricInfo from "../../../src/components/bottombar/BottomBarMetricInfo";

describe("<BottomBarMetricInfo/>", () => {

    it("should show title and metric", () => {
        let title: string = "ExpectedTitle";
        let expectedMetricName: string = "ExpectedMetricName";

        let expectedMetric: Metric = {
            key: "123",
            type: "INT",
            name: expectedMetricName
        };

        const bottomBarMetricInfo = shallow(
            <BottomBarMetricInfo title={title} metric={expectedMetric} selectedElement={null}/>
        );

        expect(bottomBarMetricInfo.html()).to.include(expectedMetricName);
        expect(bottomBarMetricInfo.html()).to.include(title);
    });

});