import {expect} from "chai";
import {MetricSearch, Metric} from "./MetricSearch";

describe("MetricSearch", () => {

    it("should filter empty list", () => {
        let metrics: Metric[] = [];
        let result: Metric[] = MetricSearch.filterMetrics(metrics);

        expect(result.length).to.be.equal(0);
    });

    it("should not filter integer", () => {
        let metrics: Metric[] = [];
        metrics.push({
            type: "INT"
        });
        let result: Metric[] = MetricSearch.filterMetrics(metrics);

        expect(result.length).to.be.equal(1);
    });

    it("should filter wrong value", () => {
        let metrics: Metric[] = [];
        metrics.push({
            type: "XXX"
        });
        let result: Metric[] = MetricSearch.filterMetrics(metrics);

        expect(result.length).to.be.equal(0);
    });

    it("should filter multiple values", () => {
        let metrics: Metric[] = [];
        metrics.push({
            type: "XXX"
        });
        metrics.push({
            type: "FLOAT"
        });
        let result: Metric[] = MetricSearch.filterMetrics(metrics);

        expect(result.length).to.be.equal(1);
    });

    it("should not find metric name by key", () => {
        let key: string = "abc";
        let expectedName: string = "expectedName" ;

        let availableMetrics: Metric[] = [];
        availableMetrics.push({
            key: "XXX",
            name: expectedName
        });
        let result: string = MetricSearch.getNameForMetricKey(availableMetrics, key);

        expect(result).to.be.equal("No name found");
    });

    it("should find metric name by key", () => {
        let keyValue: string = "abc";
        let expectedName: string = "expectedName" ;

        let availableMetrics: Metric[] = [];
        availableMetrics.push({
            key: keyValue,
            name: expectedName
        });
        let result: string = MetricSearch.getNameForMetricKey(availableMetrics, keyValue);

        expect(result).to.be.equal(expectedName);
    });
});
