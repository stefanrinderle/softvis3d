import StatusAction from "./StatusAction";

export default class LoadAction extends StatusAction {

    private _max: number | undefined;
    private _current: number | undefined;

    constructor(key: string, description: string) {
        super(key, description);
    }

    public setStatus(max: number, current: number) {
        this._max = max;
        this._current = current;
    }

    public get max(): number | undefined {
        return this._max;
    }

    public get current(): number | undefined  {
        return this._current;
    }

    public incrementMax() {
        if (typeof this._max !== "undefined") {
            this._max = this._max + 1;
        }
    }

    public incrementCurrent() {
        if (typeof this._current !== "undefined") {
            this._current = this._current + 1;
        }
    }

    public hasStatus(): boolean {
        return typeof this._current !== "undefined" && typeof this._max !== "undefined";
    }

    public get percent(): number {
        if (typeof this._current !== "undefined" && typeof this._max !== "undefined") {
            return Math.floor((100 / this._max) * this._current);
        } else {
            return 100;
        }
    }

}
