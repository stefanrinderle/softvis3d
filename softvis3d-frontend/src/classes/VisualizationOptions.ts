import {observable} from "mobx";
import {DEFAULT_HOUSE_COLOR_MODE} from "../constants/HouseColorModes";
import {district} from "../constants/Layouts";
import {noColorMetric, noMetricId} from "../constants/Metrics";
import {LOGARITHMIC} from "../constants/Scales";
import HouseColorMode from "./HouseColorMode";
import Layout from "./Layout";
import Metric from "./Metric";
import Scale from "./Scale";

export default class VisualizationOptions {

    public static createDefault(): VisualizationOptions {
        const defaultMetric = new Metric(noMetricId, " -- None -- ", "");
        return new VisualizationOptions(district, defaultMetric, defaultMetric, noColorMetric, LOGARITHMIC, DEFAULT_HOUSE_COLOR_MODE);
    }

    public layout: Layout;
    public footprint: Metric;
    public height: Metric;
    @observable
    public metricColor: Metric;
    public scale: Scale;
    public houseColorMode: HouseColorMode;

    constructor(layout: Layout, footprint: Metric, height: Metric, metricColor: Metric, scale: Scale, houseColorMode: HouseColorMode) {
        this.layout = layout;
        this.footprint = footprint;
        this.height = height;
        this.metricColor = metricColor;
        this.scale = scale;
        this.houseColorMode = houseColorMode;
    }

    public equalStructure(candidate: VisualizationOptions | null): boolean {
        if (candidate) {
            return this.layout === candidate.layout
                && this.footprint === candidate.footprint
                && this.height === candidate.height
                && this.scale === candidate.scale;
        } else {
            return false;
        }
    }
}
