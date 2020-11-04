import {Vector3} from "three";
import {AppConfiguration} from "../classes/AppConfiguration";
import BuildingColorTheme from "../classes/BuildingColorTheme";
import Layout from "../classes/Layout";
import Metric from "../classes/Metric";
import Scale from "../classes/Scale";
import {SceneColorTheme} from "../classes/SceneColorTheme";
import VisualizationLinkParams from "../classes/VisualizationLinkParams";
import {BuildingColorThemes, DEFAULT_BUILDING_COLOR_THEME} from "../constants/BuildingColorThemes";
import {Layouts} from "../constants/Layouts";
import {ColorMetrics} from "../constants/Metrics";
import {custom} from "../constants/Profiles";
import {Scales} from "../constants/Scales";
import {DEFAULT_COLOR_THEME, SceneColorThemes} from "../constants/SceneColorThemes";
import {lazyInject} from "../inversify.config";
import CityBuilderStore from "../stores/CityBuilderStore";
import SceneStore from "../stores/SceneStore";
import {default as UrlParameterService, Parameters} from "./UrlParameterService";

export default class VisualizationLinkService {

    @lazyInject("UrlParameterService")
    private readonly urlParameterService!: UrlParameterService;

    private config: AppConfiguration;

    constructor(config: AppConfiguration) {
        this.config = config;
    }

    public process(cityBuilderStore: CityBuilderStore, sceneStore: SceneStore, search: string) {
        let params: Parameters = this.urlParameterService.getQueryParams(search);

        let metricFootprint: Metric | undefined =
            cityBuilderStore.genericMetrics.getMetricByKey(params.metricFootprint);
        let metricHeight: Metric | undefined =
            cityBuilderStore.genericMetrics.getMetricByKey(params.metricHeight);

        let metricColor: Metric | undefined = ColorMetrics.getColorMetricById(params.metricColor);

        let layout: Layout | undefined = Layouts.getLayoutById(params.layout);
        let scale: Scale | undefined = Scales.getScaleById(params.scale);

        let cameraPosition = this.getCameraPosition(params);
        let colorTheme: SceneColorTheme | undefined = SceneColorThemes.getColorThemeById(params.colorTheme);

        let selectedObjectId: string | undefined = params.selectedObjectId;

        let buildingColorTheme: BuildingColorTheme | undefined = BuildingColorThemes.getModeById(params.buildingColorTheme);

        if (metricFootprint !== undefined
            && metricHeight !== undefined
            && metricColor !== undefined
            && layout !== undefined
            && scale !== undefined
            && cameraPosition !== undefined
        ) {
            if (colorTheme === undefined) {
                colorTheme = DEFAULT_COLOR_THEME;
            }
            if (buildingColorTheme === undefined) {
                buildingColorTheme = DEFAULT_BUILDING_COLOR_THEME;
            }

            let visualizationLinkParams: VisualizationLinkParams = new VisualizationLinkParams(
                metricFootprint.id, metricHeight.id, metricColor,
                layout, scale, selectedObjectId, cameraPosition, colorTheme,
                buildingColorTheme
            );

            this.applyParams(cityBuilderStore, sceneStore, visualizationLinkParams);

            cityBuilderStore.show = false;
            cityBuilderStore.initiateBuildProcess = true;
        }
    }

    public createVisualizationLink(cityBuilderStore: CityBuilderStore, sceneStore: SceneStore): string {
        return this.urlParameterService.createVisualizationLinkForCurrentUrl(document.location.href,
            this.createCurrentParams(cityBuilderStore, sceneStore));
    }

    public createPlainVisualizationLink(cityBuilderStore: CityBuilderStore, sceneStore: SceneStore): string {
        let baseUrl = "";
        if (this.config.baseUrl) {
            baseUrl = this.config.baseUrl;
        }

        const baseLocation = baseUrl + "/static/softvis3d/index.html" +
            "?projectKey=" + this.config.projectKey + "&baseUrl=" + baseUrl;

        const params = this.createCurrentParams(cityBuilderStore, sceneStore);
        return this.urlParameterService.createVisualizationLinkForCurrentUrl(baseLocation, params);
    }

    private createCurrentParams(cityBuilderStore: CityBuilderStore, sceneStore: SceneStore): Parameters {
        if (!sceneStore.cameraPosition) {
            throw new Error("sceneStore.cameraPosition is undefined or null on createVisualizationLink");
        }

        let visualizationLinkParams: VisualizationLinkParams =
            new VisualizationLinkParams(cityBuilderStore.profile.footprintMetricId,
                cityBuilderStore.profile.heightMetricId, cityBuilderStore.metricColor,
                cityBuilderStore.layout, cityBuilderStore.profile.scale,
                sceneStore.selectedObjectId, sceneStore.cameraPosition, sceneStore.colorTheme,
                cityBuilderStore.buildingColorTheme);

        return visualizationLinkParams.getKeyValuePairs();
    }

    private getCameraPosition(params: Parameters): Vector3 | undefined {
        let cameraPosition: Vector3 | undefined;
        if (params.cameraX !== undefined && params.cameraY !== undefined && params.cameraZ !== undefined) {
            cameraPosition = new Vector3(
                parseFloat(params.cameraX),
                parseFloat(params.cameraY),
                parseFloat(params.cameraZ)
            );
        }
        return cameraPosition;
    }

    private applyParams(cityBuilderStore: CityBuilderStore, sceneStore: SceneStore, visualizationLinkParams: VisualizationLinkParams) {
        cityBuilderStore.profile = custom;
        cityBuilderStore.profile.footprintMetricId = visualizationLinkParams.metricFootprintId;
        cityBuilderStore.profile.heightMetricId = visualizationLinkParams.metricHeightId;
        cityBuilderStore.metricColor = visualizationLinkParams.metricColor;
        cityBuilderStore.profile.scale = visualizationLinkParams.scale;
        cityBuilderStore.layout = visualizationLinkParams.layout;
        cityBuilderStore.buildingColorTheme = visualizationLinkParams.buildingColorTheme;

        sceneStore.selectedObjectId = visualizationLinkParams.selectedObjectId;
        sceneStore.cameraPosition = visualizationLinkParams.cameraPosition;
        sceneStore.colorTheme = visualizationLinkParams.colorTheme;
    }

}