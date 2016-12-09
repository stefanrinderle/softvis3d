import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import SelectedElementMetricInfo from "../../../src/components/topbar/SelectedElementMetricInfo";

describe("<SelectedElementMetricInfo/>", () => {

    it("should show title and metric", () => {
        let expectedTitle: string = "ExpectedTitle";
        let expectedMetricName: string = "ExpectedMetircName";
        let expectedValue: number = 123.34;

        const selectedElementMetricInfo = shallow(
            <SelectedElementMetricInfo title={expectedTitle} name={expectedMetricName} value={expectedValue} />
        );

        expect(selectedElementMetricInfo.html().includes(expectedTitle)).to.be.true;
        expect(selectedElementMetricInfo.html().includes(expectedMetricName)).to.be.true;
        expect(selectedElementMetricInfo.html().includes(expectedValue + "")).to.be.true;
    });

});