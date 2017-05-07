import {computed, observable} from "mobx";
import LoadAction from "../classes/status/LoadAction";
import ErrorAction from "../classes/status/ErrorAction";
import StatusActionQueue from "../classes/status/StatusActionQueue";
import StatusAction from "../classes/status/StatusAction";

class AppStatusStore {
    @observable
    public showLoadingQueue: boolean = false;
    @observable
    public loadingQueue: StatusActionQueue<LoadAction> = new StatusActionQueue<LoadAction>();
    @observable
    public statusQueue: StatusActionQueue<StatusAction> = new StatusActionQueue<StatusAction>();
    @observable
    public errors: StatusActionQueue<ErrorAction> = new StatusActionQueue<ErrorAction>();

    @computed
    get isVisible() {
        return !(this.loadingQueue.isEmpty && this.errors.isEmpty && this.statusQueue.isEmpty);
    }

    public status(action: StatusAction): void {
        this.statusQueue.add(action);
    }

    public removeStatus(action: StatusAction): void {
        this.statusQueue.remove(action);
    }

    public load(action: LoadAction): void {
        this.loadingQueue = this.loadingQueue.copyAndAdd(action);
    }

    public loadStatusUpdate(action: LoadAction, pageSize: number, page: number): void  {
        action.setStatus(pageSize, page);

        this.loadingQueue = this.loadingQueue.copyAndUpdate(action);
    }

    public loadStatusUpdateIncrementMax(action: LoadAction): void  {
        let current = this.loadingQueue.getAction(action.key);

        if (current) {
            action.incrementMax();
            this.loadingQueue = this.loadingQueue.copyAndUpdate(action);
        }
    }

    public loadStatusUpdateIncrementCurrent(action: LoadAction): void  {
        let current = this.loadingQueue.getAction(action.key);

        if (current) {
            action.incrementCurrent();
            this.loadingQueue = this.loadingQueue.copyAndUpdate(action);
        }
    }

    public loadComplete(action: LoadAction): void  {
        this.loadingQueue = this.loadingQueue.copyAndRemove(action);
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