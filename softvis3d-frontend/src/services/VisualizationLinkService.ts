import {CityBuilderStore} from "../stores/CityBuilderStore";
import Metric from "../classes/Metric";
import Layout from "../classes/Layout";
import {custom} from "../constants/Profiles";
import Scale from "../classes/Scale";
import ColorMetric from "../classes/ColorMetric";
import {ColorMetrics} from "../constants/Metrics";
import {Scales} from "../constants/Scales";
import {Layouts} from "../constants/Layouts";
import VisualizationLinkParams from "../classes/VisualizationLinkParams";

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

            let visualizationLinkParams: VisualizationLinkParams =
                new VisualizationLinkParams(metricFootprint, metricHeight, metricColor, layout, scale);

            this.applyParams(visualizationLinkParams);

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

    public createVisualizationLink(): string {
        let visualizationLinkParams: VisualizationLinkParams =
            new VisualizationLinkParams(this.cityBuilderStore.profile.footprint,
                this.cityBuilderStore.profile.height, this.cityBuilderStore.metricColor,
                this.cityBuilderStore.layout, this.cityBuilderStore.profile.scale);

        let params: Parameters = visualizationLinkParams.getKeyValuePairs();

        return this.createVisualizationLinkForCurrentUrl(document.location.href, params);
    }

    /**
     * public for unit tests
     */
    public createVisualizationLinkForCurrentUrl(href: string, params: Parameters): string {
        let urlContainsParams: boolean = href.indexOf("?") >= 0;

        return href + this.createUrlParameterList(params, urlContainsParams);
    }

    private applyParams(visualizationLinkParams: VisualizationLinkParams) {
        this.cityBuilderStore.profile = custom;
        this.cityBuilderStore.profile.footprint = visualizationLinkParams.metricFootprint;
        this.cityBuilderStore.profile.height = visualizationLinkParams.metricHeight;
        this.cityBuilderStore.metricColor = visualizationLinkParams.metricColor;
        this.cityBuilderStore.profile.scale = visualizationLinkParams.scale;
        this.cityBuilderStore.layout = visualizationLinkParams.layout;
    }

    private createUrlParameterList(parameters: Parameters, urlContainsParams: boolean) {
        let result: string;

        if (urlContainsParams) {
            result = "&";
        } else {
            result = "?";
        }

        for (let key in parameters) {
            if (parameters[key]) {
                result += key + "=" + parameters[key] + "&";
            }
        }

        return result.substr(0, result.length - 1);
    }

}