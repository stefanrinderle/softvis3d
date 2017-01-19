import {SceneStore} from "../stores/SceneStore";
import Softvis3dModel from "./Softvis3dModel";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import LayoutProcessor from "./LayoutProcessor";
import {reaction} from "mobx";

export default class LegacyConnector {

    private sceneStore: SceneStore;
    private cityBuilderStore: CityBuilderStore;

    public constructor(sceneStore: SceneStore, cityBuilderStore: CityBuilderStore) {
        this.sceneStore = sceneStore;
        this.cityBuilderStore = cityBuilderStore;

        reaction(
            "Convert backend data to threeJS shapes",
            () => this.sceneStore.legacyData,
            () => {
                this.buildCity(true);
            }
        );
        reaction(
            "Change color buildings on demand",
            () => this.cityBuilderStore.metricColor,
            () => {
                this.buildCity(true);
            }
        );
    }

    private buildCity(isColorUpdate: boolean) {
        if (this.sceneStore.legacyData !== null) {
            const model = new Softvis3dModel(this.sceneStore.legacyData, this.cityBuilderStore.profile.metricWidth.key,
                this.cityBuilderStore.profile.metricHeight.key, this.cityBuilderStore.metricColor.key);

            const options = {
                layout: this.cityBuilderStore.layoutType.id,
                layoutOptions: {},
                colorMetric: this.cityBuilderStore.metricColor.key,
                scalingMethod: this.cityBuilderStore.profile.scale
            };

            const processor = new LayoutProcessor(options);
            let shapes: any = processor.getIllustration(model, model._version).shapes;

            if (isColorUpdate) {
                this.sceneStore.updateShapes(shapes);
            } else {
                this.sceneStore.setShapes(shapes);
            }
        }
    }
}