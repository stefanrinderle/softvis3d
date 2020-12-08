///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import { observable } from "mobx";
import { FileFilterInterface } from "./FileFilter";
import { TreeElement } from "./TreeElement";

export abstract class StringFileFilter implements FileFilterInterface {
    @observable
    public value = "";

    public abstract shouldRemoveFile(file: TreeElement): boolean;
}

export class IncludeFileFilter extends StringFileFilter {
    public shouldRemoveFile(file: TreeElement): boolean {
        if (super.value !== "") {
            // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
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
            // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
            const match = file.name.match(this.value);
            if (match && match.length > 0) {
                return true;
            }
        }
        return false;
    }
}
