import {CityBuilderStore} from "../stores/CityBuilderStore";
import Metric from "../classes/Metric";
import Layout from "../classes/Layout";
import {custom} from "../constants/Profiles";
import Scale from "../classes/Scale";
import ColorMetric from "../classes/ColorMetric";
import {ColorMetrics} from "../constants/Metrics";
import {Scales} from "../constants/Scales";
import {Layouts} from "../constants/Layouts";

export interface Parameters {
    [id: string]: string;
}

export default class VisualizationLinkService {

    private cityBuilderStore: CityBuilderStore;

    constructor(cityBuilderStore: CityBuilderStore) {
        this.cityBuilderStore = cityBuilderStore;
    }

    public process(search: string) {
        let params: Parameters = this.getQueryParams(search);

        let metricFootprint: Metric | undefined =
            this.cityBuilderStore.genericMetrics.getMetricByKey(params.metricFootprint);
        let metricHeight: Metric | undefined =
            this.cityBuilderStore.genericMetrics.getMetricByKey(params.metricHeight);

        let metricColor: ColorMetric | undefined = ColorMetrics.getColorMetricById(params.metricColor);

        let layout: Layout | undefined = Layouts.getLayoutById(params.layout);
        let scale: Scale | undefined = Scales.getScaleById(params.scale);

        if (metricFootprint !== undefined && metricHeight !== undefined && metricColor !== undefined &&
            layout !== undefined && scale !== undefined) {
            this.cityBuilderStore.profile = custom;
            this.cityBuilderStore.profile.footprint = metricFootprint;
            this.cityBuilderStore.profile.height = metricHeight;
            this.cityBuilderStore.metricColor = metricColor;
            this.cityBuilderStore.profile.scale = scale;
            this.cityBuilderStore.layout = layout;

            this.cityBuilderStore.show = false;
            this.cityBuilderStore.initiateBuildProcess = true;
        }
    }

    /**
     * public for unit tests
     */
    public getQueryParams(qs: string): Parameters {
        qs = qs.split("+").join(" ");

        let params: Parameters = {};
        let tokens: RegExpExecArray | null;
        let re: RegExp = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }

}