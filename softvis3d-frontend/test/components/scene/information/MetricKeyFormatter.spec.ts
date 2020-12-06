import {expect} from "chai";
import MetricKeyFormatter from "../../../../src/components/scene/information/MetricKeyFormatter";
import Metric from "../../../../src/classes/Metric";
import {MetricType} from "../../../../src/classes/MetricType";

describe("MetricKeyFormatter", () => {

    it("should convert to string on integer", () => {
        const metric = new Metric("", "", "", MetricType.INT);
        const value = 347436;

        const result: string = MetricKeyFormatter.formatMeasureValue(metric, value);

        expect(result).to.be.eq(value + "");
    });

    it("should convert to date on milliseconds", () => {
        const metric = new Metric("", "", "", MetricType.MILLISEC);
        const value = 1479816020000;

        const result: string = MetricKeyFormatter.formatMeasureValue(metric, value);

        expect(result).to.contain("11");
        expect(result).to.contain("2016");
    });

    it("should return empty string on undefined value", () => {
        const metric = new Metric("", "", "", MetricType.MILLISEC);
        let value;

        const result: string = MetricKeyFormatter.formatMeasureValue(metric, value);

        expect(result).to.be.eq("n/a");
    });

});