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

    public get limit(): number {
        return this._limit;
    }

    public get current(): number {
        return this._current;
    }

    public get percent(): number {
        return Math.floor((100 / this.limit) * this.current);
    }

}
