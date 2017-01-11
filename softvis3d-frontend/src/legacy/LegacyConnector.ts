import sceneStore from "../stores/SceneStore";
import Softvis3dModel from "./Softvis3dModel";
import cityBuilderStore from "../stores/CityBuilderStore";
import LayoutProcessor from "./LayoutProcessor";
import { reaction } from "mobx";

export default class LegacyConnector {
    public init(): void {
        reaction(
            "Convert backend data to threeJS shapes",
            () => sceneStore.legacyData,
            () => { this.buildCity(sceneStore.legacyData); }
        );
        reaction(
            "Change color buildings on demand",
            () => cityBuilderStore.metricColor,
            () => { this.buildCity(sceneStore.legacyData); }
        );
    }

    private buildCity(backend: TreeElement | null) {
        if (backend === null) {
            console.error("BuildCity called with null as value for treeElement.");
        } else {
            const model = new Softvis3dModel(backend, cityBuilderStore.profile.metricWidth.key,
                cityBuilderStore.profile.metricHeight.key, cityBuilderStore.metricColor.key);

            const options = {
                layout: cityBuilderStore.layoutType.id,
                layoutOptions: {},
                colorMetric: cityBuilderStore.metricColor.key,
                scalingMethod: cityBuilderStore.profile.scale
            };

            const processor = new LayoutProcessor(options);
            sceneStore.shapes = processor.getIllustration(model, model._version).shapes;
        }
    }
}