import Metric from "../../../classes/Metric";
import {MetricType} from "../../../classes/MetricType";

export default class MetricKeyFormatter {

    public static formatMeasureValue(metric: Metric, value?: number): string {
        if (!value) {
            return "n/a";
        }

        if (metric.type === MetricType.MILLISEC) {
            return this.convertMillisecondsToDigitalClock(+value);
        }

        return value + "";
    }

    private static convertMillisecondsToDigitalClock(milliseconds: number): string {
        const date = new Date(milliseconds);
        return date.toLocaleDateString();
    }

}
