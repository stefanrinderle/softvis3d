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
        let title: string = "ExpectedTitle";
        let expectedMetricName: string = "ExpectedMetricName";

        let expectedMetric: Metric = new Metric("123", expectedMetricName, "");

        const bottomBarMetricInfo = shallow(
            <MetricKey title={title} metric={expectedMetric} selectedElement={null}/>
        );

        expect(bottomBarMetricInfo.html()).to.include(expectedMetricName);
        expect(bottomBarMetricInfo.html()).to.include(title);
    });

    it("should show title, metric and measure", () => {
        let title: string = "ExpectedTitle";
        let expectedMetricName: string = "ExpectedMetricName";

        let expectedMetric: Metric = new Metric("123", expectedMetricName, "");

        let expectedMeasure: number = 55;
        let selectedElement: TreeElement = createDefaultFile();
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
        let expectedMetric: Metric = new Metric("123", "", "", MetricType.MILLISEC);

        let expectedMeasure: number = 1479816020000;
        let selectedElement: TreeElement = createDefaultFile();
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