import {observable} from "mobx";
import {FileFilterInterface} from "./FileFilter";
import {TreeElement} from "./TreeElement";

export abstract class StringFileFilter implements FileFilterInterface {
    @observable
    public value: string = "";

    public abstract shouldRemoveFile(file: TreeElement): boolean;
}

export class IncludeFileFilter extends StringFileFilter {

    public shouldRemoveFile(file: TreeElement): boolean {
        if (super.value !== "") {
            const match = file.name.match(this.value);
            if (match === null || match.length === 0) {
                return true;
            }
        }
        return false;
    }

}

export class ExcludeFileFilter extends StringFileFilter {

    public shouldRemoveFile(file: TreeElement): boolean {
        if (super.value !== "") {
            const match = file.name.match(this.value);
            if (match && match.length > 0) {
                return true;
            }
        }
        return false;
    }

}