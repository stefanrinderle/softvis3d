import {deserialize, serialize} from "class-transformer";
import VisualizationLinkParams from "./VisualizationLinkParams";

export default class VisualizationLinkSerializationService {

    public serialize(visualizationLinkParams: VisualizationLinkParams): any {
        const data = serialize(visualizationLinkParams);
        return btoa(data);
    }

    public deserialize(input: string): VisualizationLinkParams {
        const plain = atob(input);
        return deserialize(VisualizationLinkParams, plain);
    }

}