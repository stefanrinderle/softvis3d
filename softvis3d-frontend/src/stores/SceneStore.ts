import {observable, computed, reaction} from "mobx";

class SceneStore {
    @observable public legacyData: TreeElement | null = null;
    @observable public shapes: any;
    @observable public selectedObjectId: string | null = null;
    @observable private rendered: boolean = false;

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

    @computed public get isVisible() {
        return this.rendered;
    }
}

const sceneStore = new SceneStore();

export default sceneStore;
export { SceneStore };