export default class StatusAction {

    private _key: string;
    private _description: string;

    public constructor(key: string, description: string) {
        this._key = key;
        this._description = description;
    }

    public get key() {
        return this._key;
    }

    public get description() {
        return this._description;
    }

}
