import {SceneStore} from "../stores/SceneStore";
import Softvis3dModel from "./Softvis3dModel";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import LayoutProcessor from "./LayoutProcessor";

export default class LegacyConnector {

    private sceneStore: SceneStore;
    // It is only allowed to use cityBuilderStore in the method updateSceneStoreValues
    private cityBuilderStore: CityBuilderStore;

    public constructor(sceneStore: SceneStore, cityBuilderStore: CityBuilderStore) {
        this.sceneStore = sceneStore;
        this.cityBuilderStore = cityBuilderStore;
    }

    public buildCity() {
        if (this.sceneStore.legacyData !== null) {
            const model = new Softvis3dModel(this.sceneStore.legacyData, this.sceneStore.metricWidth.key,
                this.sceneStore.metricHeight.key, this.sceneStore.metricColor.key);

            const options = {
                layout: this.sceneStore.layout.id,
                layoutOptions: {},
                colorMetric: this.sceneStore.metricColor.key,
                scalingMethod: this.sceneStore.scale
            };

            const processor = new LayoutProcessor(options);
            this.sceneStore.shapes = processor.getIllustration(model, model._version).shapes;
        }
    }
}