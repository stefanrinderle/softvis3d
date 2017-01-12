import {computed, observable} from "mobx";

class AppStatusStore {
    @observable
    public showLoadingQueue: boolean = false;
    @observable
    public loadingQueue: string[] = [];
    @observable
    public errors: string[] = [];

    @computed
    get isVisible() {
        return this.loadingQueue.length > 0 || this.errors.length > 0;
    }

    public load(event: string): void {
        this.loadingQueue.push(event);
    }

    public loadComplete(event: string): void  {
        for (let i = 0; i < this.loadingQueue.length; i++) {
            if (this.loadingQueue[i] === event) {
                this.loadingQueue.splice(i, 1);
                return;
            }
        }

        console.error(`Could not remove load event: '${event}'`);
    }

    public acknowledgeError(error: string): void  {
        for (let i = 0; i < this.errors.length; i++) {
            if (this.errors[i] === error) {
                this.errors.splice(i, 1);
                return;
            }
        }

        console.error(`Could not remove load event: '${error}'`);
    }

    public error(msg: string): void {
        this.errors.push(msg);
    }
}

const appStatusStore = new AppStatusStore();

export default appStatusStore;
export { AppStatusStore };