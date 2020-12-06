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



import {
    SQ_QUALIFIER_FILE,
    SQ_QUALIFIER_UNIT_TEST_FILE
} from "../services/sonarqube/measures/api/SonarQubeMeasureResponse";
import {FileFilterInterface} from "./FileFilter";
import {TreeElement} from "./TreeElement";

export abstract class TestClassesVariant implements SelectOptionValue, FileFilterInterface {

    public readonly id: string;
    public readonly label: string;

    protected constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }

    public abstract shouldRemoveFile(file: TreeElement): boolean;
}

export class NoTestClassesVariant extends TestClassesVariant {
    constructor() {
        super("no", "No test classes");
    }

    public shouldRemoveFile(file: TreeElement): boolean {
        return file.qualifier === SQ_QUALIFIER_UNIT_TEST_FILE;
    }
}

export class WithTestClassesVariant extends TestClassesVariant {
    constructor() {
        super("with", "With test classes");
    }

    public shouldRemoveFile(): boolean {
        return false;
    }
}

export class OnlyTestClassesVariant extends TestClassesVariant {
    constructor() {
        super("only", "Only test classes");
    }

    public shouldRemoveFile(file: TreeElement): boolean {
        return file.qualifier === SQ_QUALIFIER_FILE;
    }
}