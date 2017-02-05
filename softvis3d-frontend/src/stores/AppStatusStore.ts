import {computed, observable} from "mobx";
import LoadAction from "../classes/status/LoadAction";
import ErrorAction from "../classes/status/ErrorAction";
import StatusActionQueue from "../classes/status/StatusActionQueue";

class AppStatusStore {
    @observable
    public showLoadingQueue: boolean = false;
    @observable
    public loadingQueue: StatusActionQueue<LoadAction> = new StatusActionQueue<LoadAction>();
    @observable
    public errors: StatusActionQueue<ErrorAction> = new StatusActionQueue<ErrorAction>();

    @computed
    get isVisible() {
        return !(this.loadingQueue.isEmpty && this.errors.isEmpty);
    }

    public load(action: LoadAction): void {
        this.loadingQueue.add(action);
    }

    public loadComplete(action: LoadAction): void  {
        this.loadingQueue.remove(action);
    }

    public error(error: ErrorAction): void {
        this.errors.add(error);
    }

    public acknowledgeError(error: ErrorAction): void  {
        this.errors.remove(error);
    }
}

const appStatusStore = new AppStatusStore();

export default appStatusStore;
export { AppStatusStore };