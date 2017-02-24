import Metric from "./Metric";
import Scale from "./Scale";
import Layout from "./Layout";
import {district} from "../constants/Layouts";
import {noMetric} from "../constants/Metrics";
import {LOGARITHMIC} from "../constants/Scales";
import {observable} from "mobx";
import ColorMetric from "./ColorMetric";

export default class VisualizationOptions {

    public static createDefault(): VisualizationOptions {
        return new VisualizationOptions(district, noMetric, noMetric, noMetric, LOGARITHMIC);
    }

    public layout: Layout;
    public footprint: Metric;
    public height: Metric;
    @observable
    public metricColor: ColorMetric;
    public scale: Scale;

    constructor(layout: Layout, footprint: Metric, height: Metric, metricColor: ColorMetric, scale: Scale) {
        this.layout = layout;
        this.footprint = footprint;
        this.height = height;
        this.metricColor = metricColor;
        this.scale = scale;
    }

}
