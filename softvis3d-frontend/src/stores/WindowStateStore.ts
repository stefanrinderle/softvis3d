import {computed, observable} from "mobx";
import * as Actions from "../constants/ActionConstants";

class WindowStateStore {
    @observable public loadingEvents: string[];
    @observable private showBuilderAsap: boolean;
    @observable private sceneIsLoaded: boolean;

    public constructor() {
        this.loadingEvents = [];
        this.showBuilderAsap = false;
        this.sceneIsLoaded = false;
    }

    @computed get showLoader() {
        return this.loadingEvents.length > 0;
    }

    @computed get showBuilder() {
        return this.loadingEvents.length === 0 && this.showBuilderAsap;
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
        this.loadingEvents.push(event);
    }

    private removeLoadEvent(event: string) {
        for (let i = 0; i < this.loadingEvents.length; i++) {
            if (this.loadingEvents[i] === event) {
                this.loadingEvents.splice(i, 1);
                return;
            }
        }

        // TODO: Error-Event
    }
}

const windowStateStore = new WindowStateStore();

export default windowStateStore;
export { WindowStateStore };