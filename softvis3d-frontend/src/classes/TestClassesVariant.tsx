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