import {Type} from "class-transformer";
import {Vector3} from "three";
import VisualizationOptions from "./VisualizationOptions";

export default class VisualizationLinkParams {

    @Type(() => VisualizationOptions)
    public visualizationOptions: VisualizationOptions;
    public selectedObjectId: string | null;
    public cameraPosition: Vector3;

    constructor(visualizationOptions: VisualizationOptions,
                selectedObjectId: string | null, cameraPosition: Vector3) {
        this.visualizationOptions = visualizationOptions;
        this.selectedObjectId = selectedObjectId;
        this.cameraPosition = cameraPosition;
    }

}