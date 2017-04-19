import {SceneStore} from "../stores/SceneStore";
import Softvis3dModel from "./Softvis3dModel";
import LayoutProcessor from "./LayoutProcessor";
import LoadAction from "../classes/status/LoadAction";
import {AppStatusStore} from "../stores/AppStatusStore";

export default class LegacyCityCreator {
    private static BUILD_CITY: LoadAction = new LoadAction("BUILD_CITY", "Create layout");

    private sceneStore: SceneStore;
    private appStatusStore: AppStatusStore;

    public constructor(sceneStore: SceneStore, appStatusStore: AppStatusStore) {
        this.sceneStore = sceneStore;
        this.appStatusStore = appStatusStore;
    }

    public createCity() {
        if (this.sceneStore.legacyData !== null) {
            this.appStatusStore.load(LegacyCityCreator.BUILD_CITY);

            const model = this.loadModel();
            const processor = this.prepareProcessor({
                layout: this.sceneStore.options.layout.id,
                layoutOptions: {},
                colorMetric: this.sceneStore.options.metricColor.id,
                scalingMethod: this.sceneStore.options.scale
            });

            this.buildCity(model, processor);

            this.appStatusStore.loadComplete(LegacyCityCreator.BUILD_CITY);
        }
    }

    private loadModel() {
        return new Softvis3dModel(
            this.sceneStore.legacyData as TreeElement,
            this.sceneStore.options.footprint.id,
            this.sceneStore.options.height.id,
            this.sceneStore.options.metricColor.id
        );
    }

    private prepareProcessor(options: any) {
        return new LayoutProcessor(options);
    }

    private buildCity(model: Softvis3dModel, processor: LayoutProcessor) {
        this.sceneStore.shapes = processor.getIllustration(model, model._version).shapes;
    }
}