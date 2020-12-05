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
