import {SceneStore} from "../stores/SceneStore";
import Softvis3dModel from "./Softvis3dModel";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import LayoutProcessor from "./LayoutProcessor";
import {reaction} from "mobx";

export default class LegacyConnector {

    private sceneStore: SceneStore;
    // It is only allowed to use cityBuilderStore in the method updateSceneStoreValues
    private cityBuilderStore: CityBuilderStore;

    public constructor(sceneStore: SceneStore, cityBuilderStore: CityBuilderStore) {
        this.sceneStore = sceneStore;
        this.cityBuilderStore = cityBuilderStore;

        reaction(
            "Convert backend data to threeJS shapes",
            () => this.sceneStore.legacyData,
            () => {
                this.buildCity(false);
            }
        );
        reaction(
            "Change color buildings on demand",
            () => this.sceneStore.sceneMetricColor,
            () => {
                this.buildCity(true);
            }
        );
    }

    private buildCity(isColorUpdate: boolean) {
        this.updateSceneStoreValues();

        if (this.sceneStore.legacyData !== null) {
            const model = new Softvis3dModel(this.sceneStore.legacyData, this.sceneStore.sceneProfile.metricWidth.key,
                this.sceneStore.sceneProfile.metricHeight.key, this.sceneStore.sceneMetricColor.key);

            const options = {
                layout: this.sceneStore.sceneLayoutType.id,
                layoutOptions: {},
                colorMetric: this.sceneStore.sceneMetricColor.key,
                scalingMethod: this.sceneStore.sceneProfile.scale
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

    /**
     * TODO: I don't really have an idea where to put this code.
     */
    private updateSceneStoreValues() {
        this.sceneStore.sceneProfile = this.cityBuilderStore.profile;
        this.sceneStore.sceneLayoutType = this.cityBuilderStore.layoutType;
    }
}