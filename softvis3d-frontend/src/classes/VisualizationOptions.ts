import Metric from "./Metric";
import Scale from "./Scale";
import Layout from "./Layout";
import {district} from "../constants/Layouts";
import {noMetric} from "../constants/Metrics";
import {LOGARITHMIC} from "../constants/Scales";

export default class VisualizationOptions {

    public static createDefault(): VisualizationOptions {
        return new VisualizationOptions(district, noMetric, noMetric, noMetric, LOGARITHMIC);
    }

    public layout: Layout;
    public metricWidth: Metric;
    public metricHeight: Metric;
    public metricColor: Metric;
    public scale: Scale;

    constructor(layout: Layout, metricWidth: Metric, metricHeight: Metric, metricColor: Metric, scale: Scale) {
        this.layout = layout;
        this.metricWidth = metricWidth;
        this.metricHeight = metricHeight;
        this.metricColor = metricColor;
        this.scale = scale;
    }

}
