import {SceneStore} from "../stores/SceneStore";
import Softvis3dModel from "./Softvis3dModel";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import LayoutProcessor from "./LayoutProcessor";
import LoadAction from "../classes/status/LoadAction";
import {AppStatusStore} from "../stores/AppStatusStore";

export default class LegacyConnector {
    private static BUILD_CITY: LoadAction = new LoadAction("BUILD_CITY", "Create layout");

    private sceneStore: SceneStore;
    // It is only allowed to use cityBuilderStore in the method updateSceneStoreValues
    private cityBuilderStore: CityBuilderStore;
    private appStatusStore: AppStatusStore;

    public constructor(sceneStore: SceneStore, cityBuilderStore: CityBuilderStore, appStatusStore: AppStatusStore) {
        this.sceneStore = sceneStore;
        this.cityBuilderStore = cityBuilderStore;
        this.appStatusStore = appStatusStore;
    }

    public buildCity() {
        if (this.sceneStore.legacyData !== null) {
            this.appStatusStore.load(LegacyConnector.BUILD_CITY);

            const model = new Softvis3dModel(this.sceneStore.legacyData, this.sceneStore.options.metricWidth.key,
                this.sceneStore.options.metricHeight.key, this.sceneStore.options.metricColor.key);

            const options = {
                layout: this.sceneStore.options.layout.id,
                layoutOptions: {},
                colorMetric: this.sceneStore.options.metricColor.key,
                scalingMethod: this.sceneStore.options.scale
            };

            const processor = new LayoutProcessor(options);
            this.sceneStore.shapes = processor.getIllustration(model, model._version).shapes;

            this.appStatusStore.loadComplete(LegacyConnector.BUILD_CITY);
        }
    }
}