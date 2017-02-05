import StatusAction from "./StatusAction";

export default class ErrorAction extends StatusAction {

    public retryButtonText: string;
    private _retryCallback: () => void;

    constructor(key: string, description: string, retryButtonText: string, retryCallback: () => void) {
        super(key, description);

        this.retryButtonText = retryButtonText;
        this._retryCallback = retryCallback;
    }

    public retryCallback(): void {
        this._retryCallback();
    }
}
