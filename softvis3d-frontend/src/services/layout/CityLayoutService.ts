import LoadAction from "../../classes/status/LoadAction";
import {TreeElement} from "../../classes/TreeElement";
import {numberOfAuthorsBlameColorMetric} from "../../constants/Metrics";
import {AppStatusStore} from "../../stores/AppStatusStore";
import {SceneStore} from "../../stores/SceneStore";
import SonarQubeScmService from "../sonarqube/SonarQubeScmService";
import LayoutProcessor from "./LayoutProcessor";
import Softvis3dModel from "./Softvis3dModel";

export class CityLayoutService {
    public static BUILD_CITY: LoadAction = new LoadAction("BUILD_CITY", "Create layout");

    private sceneStore: SceneStore;
    private appStatusStore: AppStatusStore;
    private scmService: SonarQubeScmService;
    private layoutProcessor: LayoutProcessor;

    public constructor(sceneStore: SceneStore, appStatusStore: AppStatusStore, scmService: SonarQubeScmService,
                       layoutProcessor?: LayoutProcessor) {
        this.sceneStore = sceneStore;
        this.appStatusStore = appStatusStore;
        this.scmService = scmService;

        // for tests
        if (layoutProcessor) {
            this.layoutProcessor = layoutProcessor;
        } else {
            this.layoutProcessor = new LayoutProcessor();
        }
    }

    public createCity() {
        this.loadRequiredMetricData().then(
            () => {
                if (this.sceneStore.projectData !== null) {
                    this.appStatusStore.load(CityLayoutService.BUILD_CITY);

                    const model = this.prepareModel();
                    this.buildCity(model);

                    this.appStatusStore.loadComplete(CityLayoutService.BUILD_CITY);
                }
            }
        );
    }

    private loadRequiredMetricData(): Promise<void> {
        // Project data is already loaded. Otherwise multiple load
        // processes need to be chained here

        if (this.sceneStore.options.metricColor === numberOfAuthorsBlameColorMetric) {
            return this.scmService.assertScmInfoAreLoaded();
        }

        return new Promise<void>((resolve) => {
            resolve();
        });
    }

    private prepareModel() {
        return new Softvis3dModel(
            this.sceneStore.projectData as TreeElement,
            this.sceneStore.options.footprint.id,
            this.sceneStore.options.height.id,
            this.sceneStore.options.metricColor.id,
            this.sceneStore.options.buildingColorTheme
        );
    }

    private buildCity(model: Softvis3dModel) {
        const options = {
            layout: this.sceneStore.options.layout.id,
            layoutOptions: {},
            colorMetric: this.sceneStore.options.metricColor.id,
            scalingMethod: this.sceneStore.options.scale
        };

        this.sceneStore.shapes = this.layoutProcessor.getIllustration(options, model).shapes;
    }
}