import {reaction} from "mobx";
import {lazyInject} from "../inversify.config";
import {CityLayoutService} from "../services/layout/CityLayoutService";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {SceneStore} from "../stores/SceneStore";

export default class SceneReactions {

    private builder: CityBuilderStore;
    private scene: SceneStore;
    @lazyInject("CityLayoutService")
    private cityLayoutService!: CityLayoutService;

    constructor(
        scene: SceneStore,
        builder: CityBuilderStore
    ) {
        this.builder = builder;
        this.scene = scene;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            () => this.scene.options.metricColor,
            () => {
                this.builder.metricColor = this.scene.options.metricColor;
                this.cityLayoutService.createCity();
            },
            {
                name: "Transfer the chosen color from the scene to the builder and rebuild city"
            }
        );

        reaction(
            () => this.scene.projectData,
            () => {
                this.cityLayoutService.createCity();
            },
            {
                name: "Convert backend data to threeJS shapes"
            }
        );
    }
}