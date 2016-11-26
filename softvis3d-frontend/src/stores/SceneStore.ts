import {observable, computed} from "mobx";
import { INITIAL_SHAPES } from "../dtos/InitialSceneShapes";
import * as Actions from "../events/EventConstants";

class SceneStore {
    @observable public shapes: any;
    @observable public selectedObjectId: string;
    @observable private rendered: boolean;

    public constructor() {
        this.shapes = INITIAL_SHAPES;
        this.rendered = false;
    }

    public setSelectedObjectId(objectId: string | null) {
        if (objectId !== null) {
            this.selectedObjectId = objectId;
        }
    }

    @computed public get isVisible() {
        return this.rendered;
    }

    public handleEvents(event: SoftvisEvent) {
        switch (event.type) {
            case Actions.SCENE_CREATE:
                // Initiate Creation process
                break;
            case Actions.SCENE_CREATED:
                this.rendered = true;
                break;
            default:
                break;
        }
    }
}

const sceneStore = new SceneStore();

export default sceneStore;
export { SceneStore };