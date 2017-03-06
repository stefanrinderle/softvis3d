import Metric from "../classes/Metric";
import Layout from "../classes/Layout";
import Scale from "../classes/Scale";
import ColorMetric from "../classes/ColorMetric";
import {Vector3} from "three";
import {Parameters} from "../services/UrlParameterService";

export default class VisualizationLinkParams {

    private _metricFootprint: Metric;
    private _metricHeight: Metric;
    private _metricColor: ColorMetric;
    private _layout: Layout;
    private _scale: Scale;
    private _selectedObjectId: string | null;
    private _cameraPosition: THREE.Vector3;

    constructor(metricFootprint: Metric, metricHeight: Metric, metricColor: ColorMetric, layout: Layout, scale: Scale,
                selectedObjectId: string | null, cameraPosition: Vector3) {

        this._metricFootprint = metricFootprint;
        this._metricHeight = metricHeight;
        this._metricColor = metricColor;
        this._layout = layout;
        this._scale = scale;
        this._selectedObjectId = selectedObjectId;
        this._cameraPosition = cameraPosition;
    }

    public getKeyValuePairs() {
        let result: Parameters = {
            metricFootprint: this._metricFootprint.id,
            metricHeight: this._metricHeight.id,
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

    get metricFootprint(): Metric {
        return this._metricFootprint;
    }

    get metricHeight(): Metric {
        return this._metricHeight;
    }

    get metricColor(): ColorMetric {
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