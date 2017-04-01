import Metric from "../classes/Metric";
import Layout from "../classes/Layout";
import Scale from "../classes/Scale";
import { Vector3 } from "three";
import { Parameters } from "../services/UrlParameterService";

export default class VisualizationLinkParams {

    private _metricFootprintId: string;
    private _metricHeightId: string;
    private _metricColor: Metric;
    private _layout: Layout;
    private _scale: Scale;
    private _selectedObjectId: string | null;
    private _cameraPosition: THREE.Vector3;

    constructor(footprintMetricId: string, heightMetricId: string, metricColor: Metric, layout: Layout, scale: Scale,
                selectedObjectId: string | null, cameraPosition: Vector3) {

        this._metricFootprintId = footprintMetricId;
        this._metricHeightId = heightMetricId;
        this._metricColor = metricColor;
        this._layout = layout;
        this._scale = scale;
        this._selectedObjectId = selectedObjectId;
        this._cameraPosition = cameraPosition;
    }

    public getKeyValuePairs() {
        let result: Parameters = {
            metricFootprint: this._metricFootprintId,
            metricHeight: this._metricHeightId,
            metricColor: this._metricColor.id,
            layout: this._layout.id,
            scale: this._scale.getId(),
            cameraX: Math.round(this._cameraPosition.x).toString(),
            cameraY: Math.round(this._cameraPosition.y).toString(),
            cameraZ: Math.round(this._cameraPosition.z).toString()
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

}