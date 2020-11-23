import {Vector3} from "three";
import {Parameters} from "../services/UrlParameterService";
import VisualizationOptions from "./VisualizationOptions";

export default class VisualizationLinkParams {

    private readonly _visualizationOptions: VisualizationOptions;
    private readonly _selectedObjectId: string | null;
    private readonly _cameraPosition: Vector3;

    // tslint:disable-next-line:parameters-max-number
    constructor(visualizationOptions: VisualizationOptions,
                selectedObjectId: string | null, cameraPosition: Vector3) {

        this._visualizationOptions = visualizationOptions;
        this._selectedObjectId = selectedObjectId;
        this._cameraPosition = cameraPosition;
    }

    public getKeyValuePairs() {
        let result: Parameters = {
            metricFootprint: this._visualizationOptions.profile.footprintMetric.id,
            metricHeight: this._visualizationOptions.profile.heightMetric.id,
            metricColor: this._visualizationOptions.metricColor.id,
            layout: this._visualizationOptions.layout.id,
            scale: this._visualizationOptions.profile.scale.id,
            cameraX: Math.round(this._cameraPosition.x).toString(),
            cameraY: Math.round(this._cameraPosition.y).toString(),
            cameraZ: Math.round(this._cameraPosition.z).toString(),
            colorTheme: this._visualizationOptions.colorTheme.id,
            buildingColorTheme: this._visualizationOptions.buildingColorTheme.id
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

    get visualizationOptions(): VisualizationOptions {
        return this._visualizationOptions;
    }

    get selectedObjectId(): string | null {
        return this._selectedObjectId;
    }

    get cameraPosition(): Vector3 {
        return this._cameraPosition;
    }

}