import sceneStore from "../stores/SceneStore";
import Softvis3dModel from "./softvis3dModel";
import cityBuilderStore from "../stores/CityBuilderStore";
import LayoutProcessor from "./layoutProcessor";
import {reaction} from "mobx";

export default class LegacyConnector {
    /*
    private availableScalings = [
        {key: "logarithmic", name: "Logarithmic"},
        {key: "exponential", name: "Exponential"},
        {key: "linear_s", name: "Linear (scaled)"},
        {key: "linear", name: "Linear"}
    ];
     */

    public init(): void {
        reaction(
            "Convert backend data to threeJS shapes",
            () => sceneStore.legacyData,
            () => { this.buildCity(sceneStore.legacyData); }
        );
    }

    private buildCity(backend: any) {
        const model = new Softvis3dModel(backend);
        const options = {
            layout: cityBuilderStore.layoutType.id,
            layoutOptions: {},
            colorMetric: cityBuilderStore.metricColor.key,
            scalingMethod: "linear_s"
        };
        const processor = new LayoutProcessor(options);
        sceneStore.shapes = processor.getIllustration(model, model._version).shapes;
    }
}