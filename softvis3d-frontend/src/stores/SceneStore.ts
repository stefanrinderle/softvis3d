import {computed, observable} from "mobx";
import {TreeService} from "../services/TreeService";
import VisualizationOptions from "../classes/VisualizationOptions";
import {Vector3} from "three";

class SceneStore {
    @observable
    public options: VisualizationOptions = VisualizationOptions.createDefault();
    @observable
    public legacyData: TreeElement | null = null;
    @observable
    public selectedObjectId: string | null = null;
    @observable
    public shapes: any = null;
    @observable
    public sceneComponentIsMounted: boolean = false;

    public cameraPosition: Vector3 | undefined;

    @computed
    public get isVisible() {
        return this.shapes !== null;
    }

    @computed
    public get selectedElement(): TreeElement | null {
        let selectedElement: TreeElement | null = null;
        if (this.legacyData !== null && this.selectedObjectId != null) {
            selectedElement =
                TreeService.searchTreeNode(this.legacyData, this.selectedObjectId);
        }
        return selectedElement;
    }

    public getColorValue(): number | null {
        if (this.selectedElement && this.selectedElement.measures
                && this.options.metricColor.getId() in this.selectedElement.measures) {
            return this.selectedElement.measures[this.options.metricColor.getId()];
        } else {
            return null;
        }
    }
}

const sceneStore = new SceneStore();

export default sceneStore;
export { SceneStore };