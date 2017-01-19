import {observable, computed, reaction} from "mobx";
import {TreeService} from "../services/TreeService";

class SceneStore {
    @observable
    public legacyData: TreeElement | null = null;

    @observable
    public selectedObjectId: string | null = null;

    @observable
    private currentShapes: any;

    private shapesUpdate: boolean = false;

    @observable
    private rendered: boolean = false;

    private mouseMoved: boolean = false;

    public constructor() {
        this.rendered = false;

        reaction(
            "Render the threeJS scene as soon as data is available",
            () => this.currentShapes,
            () => { this.rendered = true; }
        );
    }

    public setSelectedObjectId(objectId: string | null) {
        this.selectedObjectId = objectId;
    }

    public setShapes(shapes: any) {
        this.shapesUpdate = false;
        this.currentShapes = shapes;
    }

    public updateShapes(shapes: any) {
        this.shapesUpdate = true;
        this.currentShapes = shapes;
    }

    public getShapes() {
        return this.currentShapes;
    }

    public isShapesUpdate() {
        return this.shapesUpdate;
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

    public hasMouseMoved(): boolean {
        return this.mouseMoved;
    }

    public setMoved() {
        this.mouseMoved = true;
    }

    public resetMoved() {
        this.mouseMoved = false;
    }
}

const sceneStore = new SceneStore();

export default sceneStore;
export { SceneStore };