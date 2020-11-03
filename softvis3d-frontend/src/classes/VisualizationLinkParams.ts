import {Vector3} from "three";
import Layout from "../classes/Layout";
import Metric from "../classes/Metric";
import Scale from "../classes/Scale";
import {Parameters} from "../services/UrlParameterService";
import HouseColorMode from "./HouseColorMode";
import {SceneColorTheme} from "./SceneColorTheme";

export default class VisualizationLinkParams {

    private readonly _metricFootprintId: string;
    private readonly _metricHeightId: string;
    private readonly _metricColor: Metric;
    private readonly _layout: Layout;
    private readonly _scale: Scale;
    private readonly _selectedObjectId: string | null;
    private readonly _cameraPosition: Vector3;
    private readonly _colorTheme: SceneColorTheme;
    private readonly _houseColorMode: HouseColorMode;

    // tslint:disable-next-line:parameters-max-number
    constructor(footprintMetricId: string, heightMetricId: string, metricColor: Metric, layout: Layout, scale: Scale,
                selectedObjectId: string | null, cameraPosition: Vector3, colorTheme: SceneColorTheme,
                houseColorMode: HouseColorMode) {

        this._metricFootprintId = footprintMetricId;
        this._metricHeightId = heightMetricId;
        this._metricColor = metricColor;
        this._layout = layout;
        this._scale = scale;
        this._selectedObjectId = selectedObjectId;
        this._cameraPosition = cameraPosition;
        this._colorTheme = colorTheme;
        this._houseColorMode = houseColorMode;
    }

    public getKeyValuePairs() {
        let result: Parameters = {
            metricFootprint: this._metricFootprintId,
            metricHeight: this._metricHeightId,
            metricColor: this._metricColor.id,
            layout: this._layout.id,
            scale: this._scale.id,
            cameraX: Math.round(this._cameraPosition.x).toString(),
            cameraY: Math.round(this._cameraPosition.y).toString(),
            cameraZ: Math.round(this._cameraPosition.z).toString(),
            colorTheme: this._colorTheme.id,
            houseColorMode: this._houseColorMode.id
        };

        result = this.addOptionalSelectObjectId(result);
        return result;
    }

    private addOptionalSelectObjectId(params: Parameters) {
        if (this._selectedObjectId) {
            params = Object.assign(params, {
                selectedObjectId: this._selectedObjectId
            });
        }
        return params;
    }

    get metricFootprintId(): string {
        return this._metricFootprintId;
    }

    get metricHeightId(): string {
        return this._metricHeightId;
    }

    get metricColor(): Metric {
        return this._metricColor;
    }

    get layout(): Layout {
        return this._layout;
    }

    get scale(): Scale {
        return this._scale;
    }

    get selectedObjectId(): string | null {
        return this._selectedObjectId;
    }

    get cameraPosition(): Vector3 {
        return this._cameraPosition;
    }

    get colorTheme(): SceneColorTheme {
        return this._colorTheme;
    }

    get houseColorMode(): HouseColorMode {
        return this._houseColorMode;
    }

}