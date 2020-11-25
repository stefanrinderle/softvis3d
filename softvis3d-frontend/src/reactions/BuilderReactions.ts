import {reaction} from "mobx";
import {lazyInject} from "../inversify.config";
import AutoReloadService from "../services/AutoReloadService";
import SonarQubeMeasuresService from "../services/sonarqube/measures/SonarQubeMeasuresService";
import AppStatusStore from "../stores/AppStatusStore";
import CityBuilderStore from "../stores/CityBuilderStore";
import SceneStore from "../stores/SceneStore";

export default class BuilderReactions {
    private readonly cityBuilderStore: CityBuilderStore;
    private readonly appStatusStore: AppStatusStore;
    private readonly sceneStore: SceneStore;

    @lazyInject("SonarQubeMeasuresService")
    private readonly measuresService!: SonarQubeMeasuresService;
    @lazyInject("AutoReloadService")
    private readonly autoReloadService!: AutoReloadService;

    constructor(appStatusStore: AppStatusStore, cityBuilderStore: CityBuilderStore, sceneStore: SceneStore) {
        this.appStatusStore = appStatusStore;
        this.cityBuilderStore = cityBuilderStore;
        this.sceneStore = sceneStore;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            () => this.cityBuilderStore.initiateBuildProcess,
            () => {
                if (this.cityBuilderStore.initiateBuildProcess) {
                    this.cityBuilderStore.initiateBuildProcess = false;

                    this.measuresService.loadMeasures(this.appStatusStore, this.cityBuilderStore, this.sceneStore);
                    this.autoReloadService.startAutoReload(this.appStatusStore);
                }
            },
            {
                name: "Transfer all required data to the scene"
            }
        );
    }
}