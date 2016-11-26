import { observable } from "mobx";
import { INITIAL_SHAPES } from "../dtos/InitialSceneShapes";

class SceneStore {
    @observable public shapes: any;
    @observable public selectedObjectId: string;

    public constructor() {
        this.shapes = INITIAL_SHAPES;
    }

    public setSelectedObjectId(objectId: string | null) {
        if (objectId !== null) {
            this.selectedObjectId = objectId;
        }
    }
}

const sceneStore = new SceneStore();

export default sceneStore;
export { SceneStore };