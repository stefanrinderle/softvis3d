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
import {SceneStore} from "../stores/SceneStore";
import {Vector3} from "three";
import {Parameters, default as UrlParameterService} from "./UrlParameterService";

export default class VisualizationLinkService {

    private cityBuilderStore: CityBuilderStore;
    private sceneStore: SceneStore;

    constructor(cityBuilderStore: CityBuilderStore, sceneStore: SceneStore) {
        this.cityBuilderStore = cityBuilderStore;
        this.sceneStore = sceneStore;
    }

    public process(search: string) {
        let params: Parameters = UrlParameterService.getQueryParams(search);

        let metricFootprint: Metric | undefined =
            this.cityBuilderStore.genericMetrics.getMetricByKey(params.metricFootprint);
        let metricHeight: Metric | undefined =
            this.cityBuilderStore.genericMetrics.getMetricByKey(params.metricHeight);

        let metricColor: ColorMetric | undefined = ColorMetrics.getColorMetricById(params.metricColor);

        let layout: Layout | undefined = Layouts.getLayoutById(params.layout);
        let scale: Scale | undefined = Scales.getScaleById(params.scale);

        let cameraPosition = this.getCameraPosition(params);

        let selectedObjectId: string | undefined = params.selectedObjectId;

        if (metricFootprint !== undefined
            && metricHeight !== undefined
            && metricColor !== undefined
            && layout !== undefined
            && scale !== undefined
            && cameraPosition !== undefined
        ) {
            let visualizationLinkParams: VisualizationLinkParams = new VisualizationLinkParams(
                metricFootprint, metricHeight, metricColor,
                layout, scale, selectedObjectId, cameraPosition
            );

            this.applyParams(visualizationLinkParams);

            this.cityBuilderStore.show = false;
            this.cityBuilderStore.initiateBuildProcess = true;
        }
    }

    public createVisualizationLink(): string {
        if (!this.sceneStore.cameraPosition) {
            throw new Error("this.sceneStore.cameraPosition is undefined or null on createVisualizationLink");
        }

        let visualizationLinkParams: VisualizationLinkParams =
            new VisualizationLinkParams(this.cityBuilderStore.profile.footprint,
                this.cityBuilderStore.profile.height, this.cityBuilderStore.metricColor,
                this.cityBuilderStore.layout, this.cityBuilderStore.profile.scale,
                this.sceneStore.selectedObjectId, this.sceneStore.cameraPosition);

        let params: Parameters = visualizationLinkParams.getKeyValuePairs();

        return UrlParameterService.createVisualizationLinkForCurrentUrl(document.location.href, params);
    }

    private getCameraPosition(params: Parameters): Vector3 | undefined {
        let cameraPosition: Vector3 | undefined;
        if (params.cameraX !== undefined && params.cameraY !== undefined && params.cameraZ !== undefined) {
            cameraPosition = new Vector3(
                parseInt(params.cameraX, 10),
                parseInt(params.cameraY, 10),
                parseInt(params.cameraZ, 10)
            );
        }
        return cameraPosition;
    }

    private applyParams(visualizationLinkParams: VisualizationLinkParams) {
        this.cityBuilderStore.profile = custom;
        this.cityBuilderStore.profile.footprint = visualizationLinkParams.metricFootprint;
        this.cityBuilderStore.profile.height = visualizationLinkParams.metricHeight;
        this.cityBuilderStore.metricColor = visualizationLinkParams.metricColor;
        this.cityBuilderStore.profile.scale = visualizationLinkParams.scale;
        this.cityBuilderStore.layout = visualizationLinkParams.layout;

        this.sceneStore.selectedObjectId = visualizationLinkParams.selectedObjectId;
        this.sceneStore.cameraPosition = visualizationLinkParams.cameraPosition;
    }

}