import Metric from "../../../classes/Metric";
import {MetricType} from "../../../classes/MetricType";

export default class MetricKeyFormatter {

    public static formatMeasureValue(metric: Metric, value?: number): string {
        if (value) {
            switch (metric.type) {
                case MetricType.MILLISEC:
                    return this.convertMillisecondsToDigitalClock(+value);
                default:
                    return value + "";
            }
        } else {
            return "n/a";
        }
    }

    private static convertMillisecondsToDigitalClock(milliseconds: number): string {
        let date = new Date(milliseconds);
        return date.toLocaleDateString();
    }

}
