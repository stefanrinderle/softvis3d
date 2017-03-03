import {CityBuilderStore} from "../stores/CityBuilderStore";
import Metric from "../classes/Metric";
import Layout from "../classes/Layout";
import {availableLayouts} from "../constants/Layouts";
import {custom} from "../constants/Profiles";
import Scale from "../classes/Scale";
import {availableScales} from "../constants/Scales";
import ColorMetric from "../classes/ColorMetric";
import {availableColorMetrics} from "../constants/Metrics";

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

        let metricColor: ColorMetric | undefined = this.getColorMetric(params.metricColor);

        let layout: Layout | undefined = this.getLayout(params.layout);
        let scale: Scale | undefined = this.getScale(params.scale);

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

    private getLayout(layoutId: string | undefined): Layout | undefined {
        if (layoutId !== undefined) {
            for (const availableLayout of availableLayouts) {
                if (availableLayout.id === layoutId) {
                    return availableLayout;
                }
            }
        }
    }

    private getColorMetric(metricId: string | undefined): ColorMetric | undefined {
        if (metricId !== undefined) {
            for (const availableColorMetric of availableColorMetrics) {
                if (availableColorMetric.id === metricId) {
                    return availableColorMetric;
                }
            }
        }
    }

    private getScale(scaleId: string): Scale | undefined {
        if (scaleId !== undefined) {
            for (const availableScale of availableScales) {
                if (availableScale.getId() === scaleId) {
                    return availableScale;
                }
            }
        }
    }
}