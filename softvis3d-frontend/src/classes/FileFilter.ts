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

import {Type} from "class-transformer";
import {observable} from "mobx";
import {NO_TEST_CLASSES_VARIANT} from "../constants/TestClassesVariants";
import {ExcludeFileFilter, IncludeFileFilter, StringFileFilter} from "./StringFileFilter";
import {
    NoTestClassesVariant,
    OnlyTestClassesVariant,
    TestClassesVariant,
    WithTestClassesVariant
} from "./TestClassesVariant";
import {TreeElement} from "./TreeElement";

export interface FileFilterInterface {
    shouldRemoveFile(file: TreeElement): boolean;
}

export default class FileFilter {

    @observable
    @Type(() => TestClassesVariant, {
        discriminator: {
            property: "__type",
            subTypes: [
                { value: NoTestClassesVariant, name: "NoTestClassesVariant" },
                { value: WithTestClassesVariant, name: "WithTestClassesVariant" },
                { value: OnlyTestClassesVariant, name: "OnlyTestClassesVariant" }
            ]
        }
    })
    public testClassesVariant: TestClassesVariant = NO_TEST_CLASSES_VARIANT;

    @observable
    @Type(() => ExcludeFileFilter)
    public excludeClasses: StringFileFilter = new ExcludeFileFilter();

    @observable
    @Type(() => IncludeFileFilter)
    public includeClasses: StringFileFilter = new IncludeFileFilter();

    public shouldRemoveFile(file: TreeElement): boolean {
        const filters: FileFilterInterface[] = [this.testClassesVariant, this.excludeClasses, this.includeClasses];

        for (const filter of filters) {
            if (filter.shouldRemoveFile(file)) {
                return true;
            }
        }

        return false;
    }

}
