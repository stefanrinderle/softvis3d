import {computed, observable} from "mobx";
import * as Actions from "../events/EventConstants";
import {errorOccurred} from "../events/EventInitiator";

class AppStatusStore {
    @observable public loadingQueue: string[];
    @observable public errors: string[];
    private loadListeners: string[];

    public constructor() {
        this.loadingQueue = [];
        this.errors = [];
        this.loadListeners = [];
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
                this.addLoadEvent(event.payload as string);
                break;
            default:
                this.removeLoadEvent(event.type);
                break;
        }
    }

    private removeLoadEvent(event: string): void  {
        if (this.loadListeners.indexOf(event) === -1) {
            return;
        }

        for (let i = 0; i < this.loadingQueue.length; i++) {
            if (this.loadingQueue[i] === event) {
                this.loadingQueue.splice(i, 1);
                return;
            }
        }

        errorOccurred(`Could not remove load event: '${event}'`);
    }

    private addLoadEvent(event: string): void {
        if (this.loadListeners.indexOf(event) === -1) {
            this.loadListeners.push(event);
        }

        this.loadingQueue.push(event);
    }
}

const appStatusStore = new AppStatusStore();

export default appStatusStore;
export { AppStatusStore };