import {SceneStore} from "../stores/SceneStore";
import Softvis3dModel from "./Softvis3dModel";
import LayoutProcessor from "./LayoutProcessor";
import LoadAction from "../classes/status/LoadAction";
import {AppStatusStore} from "../stores/AppStatusStore";
import SonarQubeScmService from "../services/sonarqube/SonarQubeScmService";
import {numberOfAuthorsBlameColorMetric} from "../constants/Metrics";
import {TreeElement} from "../classes/TreeElement";

export default class LegacyCityCreator {
    private static BUILD_CITY: LoadAction = new LoadAction("BUILD_CITY", "Create layout");

    private sceneStore: SceneStore;
    private appStatusStore: AppStatusStore;
    private scmService: SonarQubeScmService;

    public constructor(sceneStore: SceneStore, appStatusStore: AppStatusStore, scmService: SonarQubeScmService) {
        this.sceneStore = sceneStore;
        this.appStatusStore = appStatusStore;
        this.scmService = scmService;
    }

    public createCity() {
        this.loadRequiredMetricData().then(
            () => {
                if (this.sceneStore.legacyData !== null) {
                    this.appStatusStore.load(LegacyCityCreator.BUILD_CITY);

                    const model = this.prepareModel();
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
        );
    }

    private loadRequiredMetricData(): Promise<void> {
        // LegacyData is already loaded. Otherwise multiple load
        // processes need to be chained here

        if (this.sceneStore.options.metricColor === numberOfAuthorsBlameColorMetric) {
            return this.scmService.assertScmInfoAreLoaded();
        }

        return new Promise<void>((resolve) => { resolve(); });
    }

    private prepareModel() {
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