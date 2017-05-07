import StatusAction from "./StatusAction";

export default class LoadAction extends StatusAction {

    private _limit: number;
    private _current: number;

    constructor(key: string, description: string) {
        super(key, description);
    }

    public setStatus(limit: number, current: number) {
        this._limit = limit;
        this._current = current;
    }

    public get limit(): number | undefined {
        return this._limit;
    }

    public get current(): number | undefined  {
        return this._current;
    }

    public incrementMax() {
        if (typeof this._limit !== "undefined") {
            this._limit = this._limit + 1;
        }
    }

    public incrementCurrent() {
        if (typeof this._current !== "undefined") {
            this._current = this._current + 1;
        }
    }

    public get percent(): number {
        if (typeof this.limit !== "undefined" && typeof this.current !== "undefined") {
            return Math.floor((100 / this.limit) * this.current);
        } else {
            return 100;
        }
    }

}
