import LoadAction from "../../classes/status/LoadAction";
import {TreeElement} from "../../classes/TreeElement";
import {numberOfAuthorsBlameColorMetric} from "../../constants/Metrics";
import {lazyInject} from "../../inversify.config";
import AppStatusStore from "../../stores/AppStatusStore";
import SceneStore from "../../stores/SceneStore";
import SonarQubeScmService from "../sonarqube/SonarQubeScmService";
import LayoutProcessor from "./LayoutProcessor";
import Softvis3dModel from "./Softvis3dModel";

export default class CityLayoutService {
    public static BUILD_CITY: LoadAction = new LoadAction("BUILD_CITY", "Create layout");

    @lazyInject("LayoutProcessor")
    private readonly layoutProcessor!: LayoutProcessor;
    @lazyInject("SonarQubeScmService")
    private readonly scmService!: SonarQubeScmService;

    public createCity(sceneStore: SceneStore, appStatusStore: AppStatusStore) {
        this.loadRequiredMetricData(sceneStore, appStatusStore).then(
            () => {
                if (sceneStore.projectData !== null) {
                    appStatusStore.load(CityLayoutService.BUILD_CITY);

                    const model = this.prepareModel(sceneStore);
                    this.buildCity(appStatusStore, sceneStore, model);
                }
            }
        );
    }

    private loadRequiredMetricData(sceneStore: SceneStore, appStatusStore: AppStatusStore): Promise<void> {
        // Project data is already loaded. Otherwise multiple load
        // processes need to be chained here

        if (sceneStore.options.metricColor === numberOfAuthorsBlameColorMetric) {
            return this.scmService.assertScmInfoAreLoaded(appStatusStore, sceneStore);
        }

        return new Promise<void>((resolve) => {
            resolve();
        });
    }

    private prepareModel(sceneStore: SceneStore) {
        return new Softvis3dModel(
            sceneStore.projectData as TreeElement,
            sceneStore.options.footprint.id,
            sceneStore.options.height.id,
            sceneStore.options.metricColor.id,
            sceneStore.options.buildingColorTheme
        );
    }

    private buildCity(appStatusStore: AppStatusStore, sceneStore: SceneStore, model: Softvis3dModel) {
        const options = {
            layout: sceneStore.options.layout.id,
            layoutOptions: {},
            colorMetric: sceneStore.options.metricColor.id,
            scalingMethod: sceneStore.options.scale
        };

        this.layoutProcessor.getIllustration(options, model).then((illustration) => {
            sceneStore.shapes = illustration.shapes;

            appStatusStore.loadComplete(CityLayoutService.BUILD_CITY);
        });
    }
}