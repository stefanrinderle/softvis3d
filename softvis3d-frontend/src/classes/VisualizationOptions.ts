import {observable} from "mobx";
import {DEFAULT_BUILDING_COLOR_THEME} from "../constants/BuildingColorThemes";
import {district} from "../constants/Layouts";
import {noColorMetric, noMetricId} from "../constants/Metrics";
import {LOGARITHMIC} from "../constants/Scales";
import BuildingColorTheme from "./BuildingColorTheme";
import Layout from "./Layout";
import Metric from "./Metric";
import Scale from "./Scale";

export default class VisualizationOptions {

    public static createDefault(): VisualizationOptions {
        const defaultMetric = new Metric(noMetricId, " -- None -- ", "");
        return new VisualizationOptions(district, defaultMetric, defaultMetric, noColorMetric,
            LOGARITHMIC, DEFAULT_BUILDING_COLOR_THEME);
    }

    public layout: Layout;
    public footprint: Metric;
    public height: Metric;
    @observable
    public metricColor: Metric;
    public scale: Scale;
    public buildingColorTheme: BuildingColorTheme;

    constructor(layout: Layout, footprint: Metric, height: Metric, metricColor: Metric, scale: Scale,
                buildingColorTheme: BuildingColorTheme) {
        this.layout = layout;
        this.footprint = footprint;
        this.height = height;
        this.metricColor = metricColor;
        this.scale = scale;
        this.buildingColorTheme = buildingColorTheme;
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
