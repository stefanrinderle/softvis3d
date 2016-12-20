import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import SelectedElementMetricInfo from "../../../src/components/topbar/SelectedElementMetricInfo";

describe("<SelectedElementMetricInfo/>", () => {

    it("should show title and metric", () => {
        let expectedTitle: string = "ExpectedTitle";
        let expectedMetricName: string = "ExpectedMetricName";
        let expectedValue: number = 123.34;

        const selectedElementMetricInfo = shallow(
            <SelectedElementMetricInfo title={expectedTitle} name={expectedMetricName} value={expectedValue} />
        );

        expect(selectedElementMetricInfo.html()).to.contain(expectedTitle);
        expect(selectedElementMetricInfo.html()).to.contain(expectedMetricName);
        expect(selectedElementMetricInfo.html()).to.contain(expectedValue + "");
    });

});