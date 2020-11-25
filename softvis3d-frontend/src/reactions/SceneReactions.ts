import {reaction} from "mobx";
import {lazyInject} from "../inversify.config";
import CityLayoutService from "../services/layout/CityLayoutService";
import AppStatusStore from "../stores/AppStatusStore";
import CityBuilderStore from "../stores/CityBuilderStore";
import SceneStore from "../stores/SceneStore";

export default class SceneReactions {

    private readonly builder: CityBuilderStore;
    private readonly sceneStore: SceneStore;
    private readonly appStatusStore: AppStatusStore;

    @lazyInject("CityLayoutService")
    private readonly cityLayoutService!: CityLayoutService;

    constructor(scene: SceneStore, builder: CityBuilderStore, appStatusStore: AppStatusStore) {
        this.builder = builder;
        this.sceneStore = scene;
        this.appStatusStore = appStatusStore;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            () => this.builder.options.metricColor,
            () => {
                if (!this.builder.show) {
                    this.cityLayoutService.createCity(this.sceneStore, this.appStatusStore, this.builder);
                }
            },
            {
                name: "Transfer the chosen color from the scene to the builder and rebuild city"
            }
        );

        reaction(
            () => this.sceneStore.projectData,
            () => {
                this.cityLayoutService.createCity(this.sceneStore, this.appStatusStore, this.builder);
            },
            {
                name: "Convert backend data to threeJS shapes"
            }
        );
    }
}