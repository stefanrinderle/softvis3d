import {observable, computed, reaction} from "mobx";
import {TreeService} from "../services/TreeService";

class SceneStore {
    @observable
    public legacyData: TreeElement | null = null;

    @observable
    public shapes: any;

    @observable
    public selectedObjectId: string | null = null;

    @observable
    private rendered: boolean = false;

    public constructor() {
        this.rendered = false;

        reaction(
            "Render the threeJS scene as soon as data is available",
            () => this.shapes,
            () => { this.rendered = true; }
        );
    }

    public setSelectedObjectId(objectId: string | null) {
        if (objectId !== null) {
            this.selectedObjectId = objectId;
        }
    }

    @computed
    public get isVisible() {
        return this.rendered;
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
}

const sceneStore = new SceneStore();

export default sceneStore;
export { SceneStore };