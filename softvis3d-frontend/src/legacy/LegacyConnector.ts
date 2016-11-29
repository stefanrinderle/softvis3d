import * as Actions from "../events/EventConstants";
import {SonarQubeCommunicator} from "../sonarqube";
import {loadLegacyBackend, sceneSuccessfullyCreated} from "../events/EventInitiator";
import sceneStore from "../stores/SceneStore";
import Softvis3dModel from "./softvis3dModel";
import cityBuilderStore from "../stores/CityBuilderStore";
import LayoutProcessor from "./layoutProcessor";

export default class LegacyConnector {
    private sonarqube: SonarQubeCommunicator;

    /*
    private availableScalings = [
        {key: "logarithmic", name: "Logarithmic"},
        {key: "exponential", name: "Exponential"},
        {key: "linear_s", name: "Linear (scaled)"},
        {key: "linear", name: "Linear"}
    ];

     private availableColorMetrics = [
         { key: 'NONE', name: 'None' },
         { key: 'complexity', name: 'Complexity' },
         { key: 'coverage', name: 'Coverage' },
         { key: 'violations', name: 'Issues' },
         { key: 'ncloc', name: 'Lines of Code' },
         { key: 'open_issues', name: 'Open Issues' },
         { key: 'PACKAGE', name: 'Package Name' }
     ];
     */

    public constructor(sonarqube: SonarQubeCommunicator) {
        this.sonarqube = sonarqube;
    }

    public handleEvents(event: SoftvisEvent): void {
        switch (event.type) {
            case Actions.SCENE_CREATE:
                this.loadBackend();
                break;
            case Actions.LEGACY_LOADED:
                this.buildCity(event.payload);
                break;
            default:
                // no Action
                break;
        }
    }

    private loadBackend() {
        loadLegacyBackend();
    }

    private buildCity(backend: any) {
        const model = new Softvis3dModel(backend);
        const options = {
            layout: cityBuilderStore.layoutType.id,
            layoutOptions: {},
            colorMetric: "violations",
            scalingMethod: "linear_s"
        };
        const processor = new LayoutProcessor(options);
        sceneStore.shapes = processor.getIllustration(model, model._version);
        sceneSuccessfullyCreated();
    }
}