import {computed, observable} from "mobx";
import * as Actions from "../constants/ActionConstants";

class WindowStateStore {
    @observable public loadingQueue: string[];
    @observable private showBuilderAsap: boolean;
    @observable private sceneIsLoaded: boolean;

    public constructor() {
        this.loadingQueue = [];
        this.showBuilderAsap = false;
        this.sceneIsLoaded = false;
    }

    @computed get showStatus() {
        return this.loadingQueue.length > 0;
    }

    @computed get showBuilder() {
        return this.loadingQueue.length === 0 && this.showBuilderAsap;
    }

    @computed get showScene() {
        return this.sceneIsLoaded;
    }

    public handleEvents(event: SEvent): void {
        switch (event.type) {
            case Actions.INIT_APP:
                this.showBuilderAsap = true;
                break;
            case Actions.SCENE_CREATE:
                this.showBuilderAsap = false;
                this.sceneIsLoaded = true;
                break;
            case Actions.LOAD_ACTION:
                this.pushLoadEvent(event.payload as string);
                break;
            case Actions.METRICS_LOADED:
            case Actions.SCENE_CREATED:
                this.removeLoadEvent(event.type);
                break;
            default:
                break;
        }
    }

    private pushLoadEvent(event: string) {
        this.loadingQueue.push(event);
    }

    private removeLoadEvent(event: string) {
        for (let i = 0; i < this.loadingQueue.length; i++) {
            if (this.loadingQueue[i] === event) {
                this.loadingQueue.splice(i, 1);
                return;
            }
        }

        // TODO: Error-Event
    }
}

const windowStateStore = new WindowStateStore();

export default windowStateStore;
export { WindowStateStore };