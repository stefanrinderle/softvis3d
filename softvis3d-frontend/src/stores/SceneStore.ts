import {computed, observable, observe} from "mobx";
import {Vector3} from "three";
import {SceneColorTheme} from "../classes/SceneColorTheme";
import {TreeElement} from "../classes/TreeElement";
import VisualizationOptions from "../classes/VisualizationOptions";
import {DEFAULT_COLOR_THEME} from "../constants/SceneColorThemes";
import {lazyInject} from "../inversify.config";
import TreeService from "../services/TreeService";

class SceneStore {
    @observable
    public options: VisualizationOptions = VisualizationOptions.createDefault();
    @observable
    public projectData: TreeElement | null = null;
    @observable
    public selectedObjectId: string | null = null;
    @observable
    public shapes: any = null;
    @observable
    public shapesHash: string = "";

    public cameraPosition?: Vector3;
    public scmMetricLoaded: boolean;
    public colorTheme: SceneColorTheme = DEFAULT_COLOR_THEME;

    @lazyInject("TreeService")
    private treeService!: TreeService;

    public constructor() {
        this.scmMetricLoaded = false;
        observe(this, "shapes", () => { this.shapesHash = (Date.now()).toString(36); });
    }

    @computed
    public get isVisible() {
        return this.shapes !== null;
    }

    @computed
    public get selectedElement(): TreeElement | null {
        let selectedElement: TreeElement | null = null;
        if (this.projectData !== null && this.selectedObjectId != null) {
            selectedElement =
                this.treeService.searchTreeNode(this.projectData, this.selectedObjectId);
        }
        return selectedElement;
    }

    public getColorValue(): number | null {
        if (this.selectedElement && this.selectedElement.measures
                && this.options.metricColor.id in this.selectedElement.measures) {
            return this.selectedElement.measures[this.options.metricColor.id];
        } else {
            return null;
        }
    }
}

const sceneStore = new SceneStore();

export default sceneStore;
export { SceneStore };