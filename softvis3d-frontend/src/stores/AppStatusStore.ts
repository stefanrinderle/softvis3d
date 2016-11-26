import {computed, observable} from "mobx";
import * as Actions from "../events/EventConstants";
import {errorOccurred} from "../events/EventInitiator";

class AppStatusStore {
    @observable public loadingQueue: string[];
    @observable public errors: string[];

    public constructor() {
        this.loadingQueue = [];
        this.errors = [];
    }

    @computed get isVisible() {
        return this.loadingQueue.length > 0 || this.errors.length > 0;
    }

    public handleEvents(event: SoftvisEvent) {
        switch (event.type) {
            case Actions.ERROR_OCCURRED:
                this.errors.push(event.payload as string);
                break;
            case Actions.LOAD_ACTION:
                this.loadingQueue.push(event.payload as string);
                break;
            case Actions.METRICS_LOADED:
            case Actions.SCENE_CREATED:
                this.removeLoadEvent(event.type);
                break;
            default:
                break;
        }
    }

    private removeLoadEvent(event: string) {
        for (let i = 0; i < this.loadingQueue.length; i++) {
            if (this.loadingQueue[i] === event) {
                this.loadingQueue.splice(i, 1);
                return;
            }
        }

        errorOccurred(`Could not remove load event: '${event}'`);
    }
}

const appStatusStore = new AppStatusStore();

export default appStatusStore;
export { AppStatusStore };