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
    @observable
    public analysisDate: Date | undefined;

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
        this.loadingQueue.add(action);
    }

    public loadStatusUpdate(actionKey: string, max: number, current: number): void {
        let savedAction = this.loadingQueue.getAction(actionKey);

        if (savedAction) {
            savedAction.setStatus(max, current);
            this.loadingQueue = this.loadingQueue.update(savedAction);
        }
    }

    public loadStatusUpdateIncrementMax(actionKey: string): void {
        let savedAction = this.loadingQueue.getAction(actionKey);

        if (savedAction) {
            savedAction.incrementMax();
            this.loadingQueue = this.loadingQueue.update(savedAction);
        }
    }

    public loadStatusUpdateIncrementCurrent(actionKey: string): void {
        let savedAction = this.loadingQueue.getAction(actionKey);

        if (savedAction) {
            savedAction.incrementCurrent();
            this.loadingQueue = this.loadingQueue.update(savedAction);
        }
    }

    public loadComplete(action: LoadAction): void {
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
export {AppStatusStore};