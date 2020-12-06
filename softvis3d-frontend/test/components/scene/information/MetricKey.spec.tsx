import {expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import Metric from "../../../../src/classes/Metric";
import {MetricType} from "../../../../src/classes/MetricType";
import {TreeElement} from "../../../../src/classes/TreeElement";
import MetricKey from "../../../../src/components/scene/information/MetricKey";
import {createDefaultFile} from "../../../classes/TreeElement.spec";

describe("<MetricKey/>", () => {

    it("should show title and metric", () => {
        const title = "ExpectedTitle";
        const expectedMetricName = "ExpectedMetricName";

        const expectedMetric: Metric = new Metric("123", expectedMetricName, "");

        const bottomBarMetricInfo = shallow(
            <MetricKey title={title} metric={expectedMetric} selectedElement={null}/>
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
            123: expectedMeasure
        };
        const bottomBarMetricInfo = shallow(
            <MetricKey title={title} metric={expectedMetric} selectedElement={selectedElement}/>
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
            123: expectedMeasure
        };
        const bottomBarMetricInfo = shallow(
            <MetricKey title={""} metric={expectedMetric} selectedElement={selectedElement}/>
        );

        expect(bottomBarMetricInfo.html()).to.include("11");
        expect(bottomBarMetricInfo.html()).to.include("2016");
    });

});