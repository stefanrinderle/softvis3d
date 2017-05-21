import {SceneStore} from "../stores/SceneStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {reaction} from "mobx";
import {CityLayoutService} from "../services/layout/CityLayoutService";

export default class SceneReactions {

    private builder: CityBuilderStore;
    private scene: SceneStore;
    private cityLayoutService: CityLayoutService;

    constructor(
        scene: SceneStore,
        builder: CityBuilderStore,
        cityLayoutService: CityLayoutService
    ) {
        this.builder = builder;
        this.scene = scene;
        this.cityLayoutService = cityLayoutService;
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